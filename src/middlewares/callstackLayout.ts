/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

import { Stage, PatchFn, TopoData, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import { toTranslate, } from '../utils';
import { CALLSTACK_HEIGHT, } from '../constants';

// 调用栈布局
export const callstackLayout = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  const nodes: (string | VNode)[] = stage.getStageNode().children;

  nodes.filter((item: (VNode|string)) => {
    const node = item as VNode;
    if (!node.data.class)
      return false;

    if (!node.data.class['callstack'])
      return false;
    
    return true;
  }).forEach((item: VNode, index: number) => {
    item.data = {
      ...item.data,
      style: {
        transform: toTranslate(0, index * CALLSTACK_HEIGHT + 45),
      },
    };
  });

  next(userState);
};

