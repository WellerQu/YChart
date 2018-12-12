/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';
import { group, parseTranslate, updateLinePosition, } from '../utils';
import { Stage, PatchBehavior, TopoData, Position,} from '../../typings/defines';
import { ID_COMBINER, } from '../constants/constants';

/**
 * 用线段连接每一个节点
 */
export const linkLine = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  if (!userState)
    return next(userState);

  const root = stage.stageNode();
  const [ lines, nodes, rests, ] = group(root.children as VNode[]);

  const positionMap = new Map<string, Position>();
  nodes.forEach((item: VNode) => {
    positionMap.set(item.data.key as string, parseTranslate(item.data.style['transform']));
  });

  lines.forEach((item: VNode) => {  
    const id = item.data.attrs['id'] as string;
    if (!id.split) return item;

    const [source, target,] = id.split(ID_COMBINER);
    if (!positionMap.has(source)) return item;
    if (!positionMap.has(target)) return item;

    const start = positionMap.get(source);
    const end = positionMap.get(target);
    // 更新线的起始与结束坐标
    return updateLinePosition(item, start, end);
  });

  next(userState);
};
