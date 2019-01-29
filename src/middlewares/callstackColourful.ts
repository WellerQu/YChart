/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { Stage, PatchBehavior, CallstackData, } from '../@types';
import { VNode, } from 'snabbdom/vnode';


const predicate = (className: string) => (item: VNode) => {
  if (!item.data.class)
    return false;

  return item.data.class[className]; 
};
const CALL_STACK_CLASS = 'callstack', CALL_LINE_CLASS = 'callline';

// 调用栈着色
export const callstackColourful = (stage: Stage) => (next: PatchBehavior) => (userState?: CallstackData[]) => {
  if (!userState)
    return next(userState);

  const nodes: (string | VNode)[] = stage.stageNode().children;

  const stackGroups = nodes.filter(predicate(CALL_STACK_CLASS));
  const lineGroups = nodes.filter(predicate(CALL_LINE_CLASS));
  const colourMap = new Map<string, string>();

  stackGroups.forEach((item: VNode, index: number) => {
    const ID = item.data.attrs.id as string;
    const rectNode = item.children[0] as VNode;
  });

  lineGroups.forEach((item: VNode) => {
    const ID = item.data.attrs.id as string;
    if (!ID.split)
      return;

    const [, parentID,] = ID.split('-');
    const line = item.children[0] as VNode;
    const arrow = item.children[1] as VNode;
    const colour = colourMap.get(parentID);

    arrow.data.attrs.fill = colour;
    line.data.attrs.stroke = arrow.data.attrs.stroke = colour;
  });

  next(userState);
};