import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import { setupEventHandler, throttle, clamp, parseViewBoxValue, toViewBox, parseTranslate, } from '../utils';
import { VNode, } from 'snabbdom/vnode';
import { NODE_TYPE, } from '../NODE_TYPE';
import { NODE_SIZE, CELL_SIZE, } from '../constants';

// limit range
const widthClamp = clamp(320, 2420);
const heightClamp = clamp(160, 1210);

const handleMousewheel = (event: MouseWheelEvent): MouseEvent => {
  let svgElement = event.target as HTMLElement;
  while(svgElement.nodeName.toUpperCase() !== 'SVG') {
    svgElement = svgElement.parentElement;
  }

  const viewBox = svgElement.getAttribute('viewBox');
  const [x, y, width, height,] = parseViewBoxValue(viewBox);

  const diffWidth = 20;
  const diffHeight = diffWidth * height / width;

  if (event.deltaY > 0) {
    // to bigger
    const newWidth = widthClamp(width - diffWidth);
    const newHeight = heightClamp(height - diffHeight);

    const newX = newWidth * x / width;
    const newY = newHeight * y / height;

    svgElement.setAttribute('viewBox', toViewBox(newX, newY, newWidth, newHeight));
  } else if (event.deltaY < 0) {
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

  const graphWidth = maximumX - minimumX + NODE_SIZE;
  const graphHeight = maximumY - minimumY + NODE_SIZE;
  if (graphWidth > graphHeight) {
    const offsetY = (size.height * graphWidth / size.width - graphHeight) / -2 + minimumY;
    stage.viewbox({ x: minimumX, y: offsetY, width: graphWidth, height: graphWidth * size.height / size.width, });
  } else if (graphWidth < graphHeight) {
    const offsetX = (size.width * graphHeight / size.height - graphWidth) / -2 + minimumX;
    stage.viewbox({ x: offsetX, y: minimumY, width: graphHeight * size.width / size.height, height: graphHeight, });
  }

  next(userState);
};