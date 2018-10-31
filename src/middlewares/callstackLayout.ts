/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

import { Stage, PatchFn, CallstackData, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import { toTranslate, parseTranslate, } from '../utils';
import { CALLSTACK_HEIGHT, } from '../constants';

// 调用栈布局
export const callstackLayout = (stage: Stage) => (next: PatchFn) => (userState?: CallstackData[]) => {
  const nodes: (string | VNode)[] = stage.getStageNode().children;

  nodes.filter((item: (VNode|string)) => {
    const node = item as VNode;
    if (!node.data.class)
      return false;

    if (!node.data.class['callstack'])
      return false;
    
    return true;
  }).forEach((item: VNode, index: number) => {
    const position = parseTranslate(item.data.style.transform);
    item.data = {
      ...item.data,
      style: {
        transform: toTranslate(position.x, index * CALLSTACK_HEIGHT + 45),
      },
    };
  });

  next(userState);
};

