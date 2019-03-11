/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { Stage, PatchBehavior, CallstackData, EventOption, } from '../@types';
import { CALLSTACK_HEIGHT, RULE_HEIGHT, STACK_SPACE, TEXT_AREA_WIDTH, } from '../constants/constants';
import { h, } from 'snabbdom';
import { setupEventHandler, } from '../utils';

const INDENT = 20;
const OFFSET_X = 10;
const WORD_WIDTH = 8;
const ELLIPSIS_WIDTH = 3 * WORD_WIDTH;
const PADDING_RIGHT = 90;
const PADDING_LEFT = 50;

type Action = (prevNode:CallstackData, node: CallstackData) => void;

const flatten = (node: CallstackData): CallstackData[] => {
  if (!node) return [];
  if (!node.children) return [node,];

  return node.children.reduce<CallstackData[]>((arr: CallstackData[], item: CallstackData) => {
    return arr.concat(flatten(item));
  }, [node,]);
};

const walkTree = (prevNode:CallstackData, node: CallstackData, action: Action) => {
  if (!node) return;

  node.indent = node.indent || 0;
  action(prevNode, node);

  if (!node.children) return;

  let lastChild: CallstackData = null;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];

    child.parentId = node.spanId;
    child.indent = node.indent + INDENT;
    child.timeOffset = child.timeOffset < 0 ? 0 : child.timeOffset;

    walkTree(lastChild, child, action); 
    lastChild = child;

    // 判断是否有合并的渲染项
    if (child.combinedCount > 0) {
      i += child.combinedCount - 1; // 减一是因为combinedCount计数包含了自己
    }
  }
};

// 调用栈布局
export const callstackLayout = (stage: Stage) => (next: PatchBehavior) => (userState?: CallstackData) => {
  if (!userState)
    return next(userState);

  const handler = (data: CallstackData) => (event: MouseEvent) => {
    const stackClickEvent = new CustomEvent('stackclick', {
      detail: data,
    });
    root.elm.dispatchEvent(stackClickEvent);

    return event;
  };

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
    actions.push(`M${i * stepWidth + TEXT_AREA_WIDTH},${RULE_HEIGHT + 15} l0,10`); 
    root.children.push(h('text', {
      attrs: {
        x: i * stepWidth + TEXT_AREA_WIDTH,
        y: RULE_HEIGHT + 8,
      }
      ,
      class: { calibration: true, center: true, },
      ns: 'http://www.w3.org/2000/svg',
    }, `${((i * maxTime / 5 >> 0) / 1000).toFixed(2)} s`));
  }

  root.children.push(h('path', {
    attrs: {
      fill: 'none',
      stroke: 'hsl(206, 9%, 85%)',
      strokeWidth: 1,
      d: actions.join(' '),
    },
    class: { 'calibration-line': true, },
    ns: 'http://www.w3.org/2000/svg',
  }));

  walkTree(null, userState, (prevNode: CallstackData, node: CallstackData) => {
    const currentLineY = RULE_HEIGHT + STACK_SPACE * lineLevel;
    const nameWidth = node.transactionName.length * WORD_WIDTH;
    const combinedWidth = node.combinedCount ? OFFSET_X * 2 + node.combinedCount.toString().length * 7.4 : 0;
    // const combinedWidth = 0;
    const nameMaxWidth = (TEXT_AREA_WIDTH - (OFFSET_X * 2) - node.indent - ELLIPSIS_WIDTH - OFFSET_X - combinedWidth);

    node.transactionName = node.transactionName
      .replace(/(\\n)*/g, '')
      .replace(/(\\t)*/g, '')
      .replace(/\s{1,}/g, ' ');

    if (nameWidth >= nameMaxWidth) {
      node.showName = node.transactionName.slice(0, nameMaxWidth / WORD_WIDTH - 3) + '...';
    } else {
      node.showName = node.transactionName;
    }

    // 绘制trace名称
    const vnodeTransactionName = h('text', {
      attrs: { x: node.indent + PADDING_LEFT, y: currentLineY + 4 , },
      class: { 'trace-name': true,},
      ns: 'http://www.w3.org/2000/svg',
    }, [
      h('title', {
        ns: 'http://www.w3.org/2000/svg',
      }, node.transactionName),
      h('tspan', {
        ns: 'http://www.w3.org/2000/svg',
      }, node.showName),
    ]);
    // 绑定trace名称点击事件
    setupEventHandler(handler(node))('click')(vnodeTransactionName);
    root.children.push(vnodeTransactionName);

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
M${PADDING_LEFT + node.indent + Math.min(nameWidth, nameMaxWidth) + OFFSET_X + combinedWidth},${currentLineY}\
h${availableWidth - PADDING_LEFT - node.indent - Math.min(nameWidth, nameMaxWidth) - OFFSET_X - combinedWidth - PADDING_RIGHT}`,
      },
      ns: 'http://www.w3.org/2000/svg',
    }));

    // 绘制耗时度量条
    const barX = TEXT_AREA_WIDTH + node.timeOffset * ruleMaxWidth / maxTime;
    const width = node.elapsedTime * ruleMaxWidth / maxTime;
    const barOption = {
      fill: node.fill || 'red',
      x: barX,
      y: currentLineY - CALLSTACK_HEIGHT / 2,
      width: width < 8 ? 8 : width,
      height: CALLSTACK_HEIGHT,
    };
    const vnodeElapsedTime = h('rect', {
      attrs: { 
        ...barOption,
      },
      class: { 'elapsed-time-bar': true, },
      ns: 'http://www.w3.org/2000/svg',
    }, [
      h('title', {
        ns: 'http://www.w3.org/2000/svg',
      }, node.transactionName),
    ]);
    // 绑定trace耗时度量条点击事件
    setupEventHandler(handler(node))('click')(vnodeElapsedTime);
    root.children.push(vnodeElapsedTime);

    // 投影
    root.children.push(h('rect', {
      attrs: { 
        ...barOption,
        y: RULE_HEIGHT + STACK_SPACE + CALLSTACK_HEIGHT,
        height: CALLSTACK_HEIGHT / 2,
        opacity: 0.2,
      },
      ns: 'http://www.w3.org/2000/svg',
    }));

    // 绘制耗时文本
    const elapsedX = barX + width + OFFSET_X;
    root.children.push(h('text', {
      attrs: { x: elapsedX, y: currentLineY + 4 , },
      class: { 'elapsed-time': true, },
      ns: 'http://www.w3.org/2000/svg',
    }, (node.elapsedTime < 1 ? '< 1' : node.elapsedTime) + 'ms'));

    // 绘制合并数;
    if (node.combinedCount > 0) {
      root.children.push(h('text', {
        attrs: {
          x: PADDING_LEFT + node.indent + Math.min(nameWidth, nameMaxWidth) + OFFSET_X * 2,
          y: currentLineY + 2,
        },
        class: { combined: true, center: true, },
        ns: 'http://www.w3.org/2000/svg',
      }, [
        h('title', {
          ns: 'http://www.w3.org/2000/svg',
        }, 'These calls were combined in a batch'),
        h('tspan', {
          ns: 'http://www.w3.org/2000/svg',
        }, node.combinedCount),
      ]));
    }

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
