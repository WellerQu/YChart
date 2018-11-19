/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import { NODE_TYPE, } from '../constants/constants';

// const parsePath = (value: string): [Position, Position] => {
//   const regExp = /M(\d+(\.\d+)?),(\d+(\.\d+)?) L(\d+(\.\d+)?),(\d+(\.\d+)?)/ig;
//   if (!regExp.test(value))
//     return null;

//   return [
//     { x: Number(RegExp.$1), y: Number(RegExp.$3), },
//     { x: Number(RegExp.$5), y: Number(RegExp.$7), },
//   ];
// };

// Motion for the Line in Topo
export const topoMotion = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  if (!userState)
    return next(userState);

  const root = stage.stageNode();
  const lineGroups = root.children.filter((item: VNode) => {
    if (!(item as VNode).sel) return false;

    return item.sel === 'g' && item.data.class[NODE_TYPE.LINE];
  });

  lineGroups.forEach((item: VNode) => {
    item.data.hook = {
      insert: (vnode: VNode) => {
      },
    };
  });

  next(userState);
};