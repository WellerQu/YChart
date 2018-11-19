/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';
import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import { NODE_TYPE, } from '../constants/constants';
import { group, } from '../utils';

interface LayoutItem {
  callerCount: number;
  calledCount: number;
  node: VNode;
  children: Set<VNode>;
};

export const nodeComplexNetworkLayout = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  const root = stage.stageNode();
  const [ lines, nodes, rests, ] = group(root.children as VNode[]);

  // 若节点数大于500 或者小于4, 则被认为不适合本布局
  if (nodes.length >= 500 || nodes.length < 4) 
    return next(userState);

  

  root.children = [...rests, ...lines, ...nodes,];

  next(userState);
};