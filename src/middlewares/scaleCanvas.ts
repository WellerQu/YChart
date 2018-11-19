/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import { setupEventHandler, throttle, clamp, parseViewBoxValue, toViewBox, parseTranslate, } from '../utils';
import { VNode, } from 'snabbdom/vnode';
import { NODE_SIZE, NODE_TYPE, } from '../constants/constants';

// limit range
const widthClamp = clamp(320, 2420);
const heightClamp = clamp(160, 1210);
const MIN_NODE_COUNT = 3;

const handleMousewheel = (event: MouseWheelEvent): MouseEvent => {
  let svgElement = event.target as HTMLElement;
  while(svgElement.nodeName.toUpperCase() !== 'SVG') {
    svgElement = svgElement.parentElement;
  }

  const viewBox = svgElement.getAttribute('viewBox');
  const [x, y, width, height,] = parseViewBoxValue(viewBox);

  const diffWidth = 20;
  const diffHeight = diffWidth * height / width;

  if (event.deltaY < 0) {
    // to bigger
    const newWidth = widthClamp(width - diffWidth);
    const newHeight = heightClamp(height - diffHeight);

    const newX = newWidth * x / width;
    const newY = newHeight * y / height;

    svgElement.setAttribute('viewBox', toViewBox(newX, newY, newWidth, newHeight));
  } else if (event.deltaY > 0) {
    // to smaller
    const newWidth = widthClamp(width + diffWidth);
    const newHeight = heightClamp(height + diffHeight);

    const newX = newWidth * x / width;
    const newY = newHeight * y / height;

    svgElement.setAttribute('viewBox', toViewBox(newX, newY, newWidth, newHeight));
  }

  return event;
};

const setupMousewheel = setupEventHandler(throttle(handleMousewheel, 20))('mousewheel');

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

  if (children.length === 0)
    return next(userState);

  // 初始化缩放比例
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
    if (minimumX > position.x) 
      minimumX = position.x;
    if (maximumX < position.x)
      maximumX = position.x;
    if (minimumY > position.y)
      minimumY = position.y;
    if (maximumY < position.y)
      maximumY = position.y;
  });

  maximumX += NODE_SIZE;
  maximumY += NODE_SIZE;

  // Example:
  // stage.viewbox({ x: minimumX, y: offsetY, width: graphWidth, height: graphWidth * size.height / size.width, });
  // stage.viewbox({ x: offsetX, y: minimumY, width: graphHeight * size.width / size.height, height: graphHeight, });

  const graphWidth = maximumX - minimumX;
  const graphHeight = maximumY - minimumY;

  if (children.length < MIN_NODE_COUNT) {
    // 若节点数非常少, 则仅仅居中而不缩放比例
    stage.viewbox(
      {
        x: (size.width - graphWidth) / -2 + minimumX,
        y: (size.height - graphHeight) / -2 + minimumY,
        width: size.width, 
        height: size.height,
      }
    );

    return next(userState);
  }

  const offsetY = (size.height * graphWidth / size.width - graphHeight) / -2 + minimumY;
  const offsetX = (size.width * graphHeight / size.height - graphWidth) / -2 + minimumX;
  const acceptWidth = graphHeight * size.width / size.height;
  const acceptHeight = graphWidth * size.height / size.width;

  if (graphWidth > graphHeight && size.width <= size.height) {
    stage.viewbox({x: minimumX, y: offsetY, width: graphWidth, height: acceptHeight, });
  } else if (graphWidth <= graphHeight && size.width > size.height) {
    stage.viewbox({ x: offsetX, y: minimumY, width: acceptWidth, height: graphHeight, });
  } else if (graphWidth <= graphHeight && size.width <= size.height) {
    stage.viewbox({ x: offsetX, y: minimumY, width: acceptWidth, height: graphHeight, });
  } else if (graphWidth > graphHeight && size.width > size.height) {
    stage.viewbox({ x: minimumX, y: offsetY, width: graphWidth, height: acceptHeight, });
  } else if (graphWidth === graphHeight && size.width === size.height) {
    stage.viewbox({ x: minimumX, y: minimumY, width: graphWidth, height: graphWidth, });
  }

  next(userState);
};