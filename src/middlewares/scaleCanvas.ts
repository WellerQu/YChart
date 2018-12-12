/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import {
  setupEventHandler,
  throttle,
  clamp,
  parseViewBoxValue,
  toViewBox,
  parseTranslate,
  findRoot,
} from '../utils';
import { VNode, } from 'snabbdom/vnode';
import { NODE_SIZE, NODE_TYPE, } from '../constants/constants';
import compose from '../compose';

// limit range
const scaleClamp = clamp(-0.9, 1);

let offsetX = 0, offsetY = 0, isDragging = false;
const startPosition = { x: 0, y: 0, };

// 缩放比例
let scale = 0;

const handleMousewheel = (event: MouseWheelEvent): MouseEvent => {
  if (event.deltaY === 0)
    return event;

  const svgElement = findRoot(event);

  // changes to bigger if direct is -1, or changes to smaller
  const direct = event.deltaY < 0 ? -1 : 1;
  scale += direct / 100;

  scale = scaleClamp(scale);

  const width = svgElement.clientWidth, height = svgElement.clientHeight;
  const newWidth = width * (1 + scale), newHeight = height * (1 + scale);

  console.log(newWidth, newHeight);

  const newX = ((newWidth / width) - 1)* (width / -2) + offsetX;
  const newY = ((newHeight / height) - 1)* (height / -2) + offsetY;

  // 1205.3309064438224 1032.001467115687

  // set up the new parameters of viewport
  svgElement.setAttribute('viewBox', toViewBox(newX, newY, newWidth, newHeight));

  return event;
};

const handleMouseDown = (event: MouseEvent): MouseEvent => {
  isDragging = true;
  startPosition.x = event.pageX;
  startPosition.y = event.pageY;

  return event;
};

const handleMouseUp = (event: MouseEvent): MouseEvent => {
  if (!isDragging)
    return event;

  const diffX = event.pageX - startPosition.x;
  const diffY = event.pageY - startPosition.y;

  isDragging = false;
  offsetX = offsetX - diffX;
  offsetY = offsetY - diffY;

  return event;
};

const setupMousewheel = setupEventHandler(throttle(handleMousewheel, 20))('mousewheel');
const setupDragMoveHandler = compose<VNode>(
  setupEventHandler(handleMouseDown)('mousedown'),
  setupEventHandler(handleMouseUp)('mouseup'),
  setupEventHandler(handleMouseUp)('mouseout'),
);

// Scale stage
export const scaleCanvas = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  if (!userState)
    return next(userState);

  const size = stage.size();

  if (size.width === 0 || size.height === 0)
    return next(userState);

  const root = stage.stageNode();
  const children = root.children as ( VNode | string )[];

  // 绑定滚轮事件实现缩放
  setupMousewheel(root);
  // 但是拖拽画布之后要更新偏移
  setupDragMoveHandler(root);

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

  offsetX =  (size.width - graphWidth) / -2 + minimumX;
  offsetY = (size.height - graphHeight) / -2 + minimumY,

  stage.viewbox(
    {
      x: offsetX,
      y: offsetY,
      width: size.width, 
      height: size.height,
    }
  );

  return next(userState);
};