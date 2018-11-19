/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';
import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import { NODE_TYPE, } from '../constants/constants';

interface LayoutItem {
  callerCount: number;
  calledCount: number;
  node: VNode;
  children: Set<VNode>;
};

/**
 * 将VNode集合按照类型分为Node集合, Line集合, 其他集合
 * @param collection VNode集合
 * @returns
 */
function group (collection: VNode[]): [VNode[], VNode[], VNode[]] {
  const lines: VNode[] = [];
  const nodes: VNode[] = [];
  const rests: VNode[] = [];

  if (!collection || collection.length === 0)
    return [lines, nodes, rests,];

  for (let i = 0, len = collection.length; i < len; i++) {
    const item = collection[i];

    if (!item.data || !item.data.class)
      continue;

    if (item.data.class[NODE_TYPE.NODE]) {
      nodes.push(item);
      continue;
    }
    if (item.data.class[NODE_TYPE.LINE]) {
      lines.push(item);
      continue;
    }

    rests.push(item);
  }

  return [lines, nodes, rests,];
}

export const nodeComplexNetworkLayout = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  const root = stage.stageNode();
  const [ lines, nodes, rests, ] = group(root.children as VNode[]);

  // 若节点数大于500 或者小于4, 则被认为不适合本布局
  if (nodes.length >= 500 || nodes.length < 4) 
    return next(userState);

  

  root.children = [...rests, ...lines, ...nodes,];

  next(userState);
};