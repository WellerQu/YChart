/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { Stage, PatchBehavior, CallstackData, } from '../@types';
import { CALLSTACK_HEIGHT, RULE_HEIGHT, STACK_SPACE, TEXT_AREA_WIDTH, } from '../constants/constants';
import { h, } from 'snabbdom';

const INDENT = 20;
const OFFSET_X = 10;
const WORD_WIDTH = 8;
const ELLIPSIS_WIDTH = 3 * WORD_WIDTH;
const PADDING_RIGHT = 90;
const PADDING_LEFT = 50;

const flatten = (node: CallstackData): CallstackData[] => {
  if (!node) return [];
  if (!node.children) return [node,];

  return node.children.reduce<CallstackData[]>((arr: CallstackData[], item: CallstackData) => {
    return arr.concat(flatten(item));
  }, [node,]);
};

const walkTree = (prevNode:CallstackData, node: CallstackData, action: (prevNode:CallstackData, node: CallstackData) => void) => {
  if (!node) return;

  node.indent = node.indent || 0;
  action(prevNode, node);

  if (!node.children) return;

  let lastChild: CallstackData = null;
  node.children.forEach((child: CallstackData) => {
    child.parentId = node.spanId;
    child.indent = node.indent + INDENT;

    walkTree(lastChild, child, action); 

    lastChild = child;

    return child;
  });
};

// 调用栈布局
export const callstackLayout = (stage: Stage) => (next: PatchBehavior) => (userState?: CallstackData) => {
  if (!userState)
    return next(userState);

  const root = stage.stageNode();
  const stacks = flatten(userState);
  const maxTime = Math.max(...stacks.map(n => n.elapsedTime + (n.timeOffset || 0)));
  const availableWidth = stage.stageNode().data.attrs.width as number;

  let lineLevel = 1;

  // 绘制刻度尺
  const actions: string[] = [];
  const ruleMaxWidth = availableWidth - TEXT_AREA_WIDTH - PADDING_RIGHT;
  const stepWidth = ruleMaxWidth / 5; // Why is the number 5? @instana

  for (let i = 0; i <= 5; i++) {
    actions.push(`M${i * stepWidth + TEXT_AREA_WIDTH},${RULE_HEIGHT} l0,10`); 
    root.children.push(h('text', {
      attrs: {
        x: i * stepWidth + TEXT_AREA_WIDTH,
        y: RULE_HEIGHT - 6,
      },
      class: { calibration: true, center: true, },
      ns: 'http://www.w3.org/2000/svg',
    }, `${i * maxTime / 5 >> 0} ms`));
  }

  root.children.push(h('path', {
    attrs: {
      fill: 'none',
      // stroke: '#d4d8db',
      stroke: '#000',
      strokeWidth: 1,
      d: actions.join(' '),
    },
    ns: 'http://www.w3.org/2000/svg',
  }));

  walkTree(null, userState, (prevNode: CallstackData, node: CallstackData) => {
    const currentLineY = RULE_HEIGHT + STACK_SPACE * lineLevel;
    const nameWidth = node.transactionName.length * WORD_WIDTH;
    const NAME_MAX_WIDTH = (TEXT_AREA_WIDTH - (OFFSET_X * 2) - node.indent - ELLIPSIS_WIDTH - OFFSET_X);
    // const combinedWidth = node.combinedCount ? OFFSET_X : 0;

    node.transactionName = node.transactionName
      .replace(/(\\n)*/g, '')
      .replace(/(\\t)*/g, '')
      .replace(/\s{1,}/g, ' ');

    if (nameWidth >= NAME_MAX_WIDTH) {
      node.showName = node.transactionName.slice(0, NAME_MAX_WIDTH / WORD_WIDTH - 3) + '...';
    } else {
      node.showName = node.transactionName;
    }

    // 绘制trace名称
    root.children.push(h('text', {
      attrs: { x: node.indent + PADDING_LEFT, y: currentLineY + 4 , },
      class: { 'trace-name': true,},
      ns: 'http://www.w3.org/2000/svg',
    }, node.showName));

    // 绘制连线
    const lastChildrenLength = flatten(prevNode).length;
    const linePathD = lineLevel > 1 ? `\
M${node.indent + PADDING_LEFT - INDENT - OFFSET_X},${currentLineY - STACK_SPACE * (1 + lastChildrenLength)}\
v${STACK_SPACE * (1 + lastChildrenLength)}\
h${INDENT}` : '';
    root.children.push(h('path', {
      attrs: {
        style: 'font-size: 12px;',
        fill: 'none',
        stroke: '#d4d8db',
        strokeWidth: 1,
        d: `\
${linePathD}\
M${PADDING_LEFT + node.indent + Math.min(nameWidth, NAME_MAX_WIDTH) + OFFSET_X},${currentLineY}\
h${availableWidth - PADDING_LEFT - node.indent - Math.min(nameWidth, NAME_MAX_WIDTH) - OFFSET_X - PADDING_RIGHT}`,
      },
      ns: 'http://www.w3.org/2000/svg',
    }));

    // 绘制耗时度量条
    const x = TEXT_AREA_WIDTH + node.timeOffset * ruleMaxWidth / maxTime;
    const width = node.elapsedTime * ruleMaxWidth / maxTime;
    root.children.push(h('rect', {
      attrs: {
        rx: 4,
        ry: 4,
        fill: node.fill || 'red',
        x,
        y: currentLineY - CALLSTACK_HEIGHT / 2,
        width: width < 8 ? 8 : width,
        height: CALLSTACK_HEIGHT,
      },
      ns: 'http://www.w3.org/2000/svg',
    }));

    // 绘制耗时文本
    root.children.push(h('text', {
      attrs: { x: x + width + OFFSET_X, y: currentLineY + 4 , },
      class: { 'elapsed-time': true, },
      ns: 'http://www.w3.org/2000/svg',
    }, (node.elapsedTime < 1 ? '< 1' : node.elapsedTime) + 'ms'));

    lineLevel++;
  });

  // 自动适应内容高度
  const height = stacks.length * STACK_SPACE + RULE_HEIGHT + 20;
  const size = stage.size();
  const viewbox = stage.viewbox();
  stage.size({ ...size, height, });
  stage.viewbox({ ...viewbox, height, });

  next(userState);
};
