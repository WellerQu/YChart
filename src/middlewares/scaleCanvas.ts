/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { Stage, PatchBehavior, TopoData, } from '../@types';
import { parseTranslate, } from '../utils';
import { VNode, } from 'snabbdom/vnode';
import { NODE_SIZE, NODE_TYPE, } from '../constants/constants';

// Scale stage
export const scaleCanvas = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  if (!userState)
    return next(userState);

  const size = stage.size();

  if (size.width === 0 || size.height === 0)
    return next(userState);

  const root = stage.stageNode();
  const children = root.children as ( VNode | string )[];

  if (children.length === 0)
    return next(userState);

  // 初始化偏移
  const [head, ...tail] = children.filter((item: (VNode | string)) => {
    const node = item as VNode;
    if (node.data && node.data.class && node.data.class[NODE_TYPE.NODE])
      return true;

    return false;
  });

  const first = parseTranslate((head as VNode).data.style.transform);
  let minimumX = first.x, minimumY = first.y, maximumX = first.x, maximumY = first.y;

  tail.forEach((node: VNode) => {
    const position = parseTranslate(node.data.style.transform);

    minimumX = Math.min(minimumX, position.x);
    minimumY = Math.min(minimumY, position.y);
    maximumX = Math.max(maximumX, position.x);
    maximumY = Math.max(maximumY, position.y);
  });

  maximumX += NODE_SIZE;
  maximumY += NODE_SIZE;

  // 计算拓扑图整体所在最小矩形
  const graphWidth = maximumX - minimumX;
  const graphHeight = maximumY - minimumY;

  // 缩放比例
  const scale = 1 / (userState.scale || 1);

  stage.viewbox(
    {
      x: (size.width * scale - graphWidth) / -2 + minimumX,
      y: (size.height * scale - graphHeight) / -2 + minimumY,
      width: size.width * scale, 
      height: size.height * scale,
    }
  );

  return next(userState);
};