/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

import { Stage, PatchFn, CallstackData, Position, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import { toTranslate, parseTranslate, toArrowD, } from '../utils';
import { CALLSTACK_HEIGHT, RULE_HEIGHT, RULE_PADDING, } from '../constants';

const STACK_SPACE = 5;
const CALL_STACK_CLASS = 'callstack', CALL_LINE_CLASS = 'callline';
const predicate = (className: string) => (item: VNode) => {
  if (!item.data.class)
    return false;

  return item.data.class[className]; 
};

// 调用栈布局
export const callstackLayout = (stage: Stage) => (next: PatchFn) => (userState?: CallstackData[]) => {
  const nodes: (string | VNode)[] = stage.getStageNode().children;
  const positionMap = new Map<string, Position>();

  const stackGroups = nodes.filter(predicate(CALL_STACK_CLASS));
  const lineGroups = nodes.filter(predicate(CALL_LINE_CLASS));

  stackGroups.forEach((item: VNode) => {
    const position = parseTranslate(item.data.style.transform);
    const y = positionMap.size * (CALLSTACK_HEIGHT + STACK_SPACE) + RULE_HEIGHT;
    item.data = {
      ...item.data,
      style: {
        transform: toTranslate(position.x, y),
      },
    };
    positionMap.set(item.data.attrs.id as string, { x: position.x, y, });
  });

  lineGroups.forEach((item: VNode) => {
    const ID = item.data.attrs.id as string;
    if (!ID.split)
      return;

    const [stackName, parentStackName,] = ID.split('-');
    const from = positionMap.get(parentStackName);
    const to = positionMap.get(stackName);
    const middle = { x: from.x, y: to.y, };

    const lineElement = item.children[0] as VNode;
    const arrowElement = item.children[1] as VNode;

    lineElement.data.attrs.d = `\
M${from.x + RULE_PADDING},${from.y + CALLSTACK_HEIGHT} \
L${middle.x + RULE_PADDING},${middle.y + CALLSTACK_HEIGHT / 2} \
L${to.x + RULE_PADDING},${to.y + CALLSTACK_HEIGHT / 2}`;

    const arrowX = to.x + RULE_PADDING;
    const arrowY = to.y + CALLSTACK_HEIGHT / 2;
    arrowElement.data.attrs.d = toArrowD(arrowX, arrowY);
    arrowElement.data.attrs.transform = `rotate(90, ${arrowX} ${arrowY})`;
  });

  next(userState);
};
