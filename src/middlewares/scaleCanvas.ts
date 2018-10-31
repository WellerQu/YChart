import { Stage, PatchFn, TopoData, } from '../../typings/defines';
import { setupEventHandler, throttle, clamp, parseViewBoxValue, toViewBox, } from '../utils';

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
export const scaleCanvas = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  const root = stage.stageNode();

  setupMousewheel(root);

  // 视域左上角定位元素 
  // 开发模式开启协助开发
  // root.children.push(
  //  h('rect', { attrs:{ x: 0, y: 0, width: 10, height: 10, fill: 'red'}, ns: 'http://www.w3.org/2000/svg',})
  // );

  next(userState);
};