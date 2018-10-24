import { Stage, PatchFn, TopoData } from '../../typings/defines';
import { setupEventHandler, throttle, clamp, parseViewBoxValue, } from '../utils';
import { h } from '../../node_modules/snabbdom/h';

// limit range
const widthClamp = clamp(320, 2420);
const heightClamp = clamp(160, 1210);

// 转换为ViewBox的字符串值
const transformViewBox = (x: number, y: number, width: number, height: number): string => `${x},${y},${width},${height}`;

const handleMousewheel = (event: MouseWheelEvent): MouseEvent => {
  let svgElement = event.target as HTMLElement;
  while(svgElement.nodeName.toUpperCase() !== 'SVG') {
    svgElement = svgElement.parentElement;
  }

  const viewBox = svgElement.getAttribute('viewBox');
  const [x, y, width, height] = parseViewBoxValue(viewBox);

  const diffWidth = 20;
  const diffHeight = diffWidth * height / width;

  const offsetX = event.clientX - svgElement.parentElement.offsetLeft;
  const offsetY = event.clientY - svgElement.parentElement.offsetTop;

  const initializeWidth = svgElement.parentElement.offsetWidth;
  const initializeHeight = svgElement.parentElement.offsetHeight;

  if (event.deltaY > 0) {
    // 放大
    const newWidth = widthClamp(width - diffWidth);
    const newHeight = heightClamp(height - diffHeight);

    const newOffsetX = newWidth * offsetX / initializeWidth;
    const newOffsetY = newHeight * offsetY / initializeHeight;

    const newX = newWidth * x / width;
    const newY = newHeight * y / height;

    console.log(newOffsetX, newOffsetY);

    svgElement.setAttribute('viewBox', transformViewBox(newX, newY, newWidth, newHeight));
  } else if (event.deltaY < 0) {
    // 缩小
    const newWidth = widthClamp(width + diffWidth);
    const newHeight = heightClamp(height + diffHeight);

    const newX = newWidth * x / width;
    const newY = newHeight * y / height;

    const newOffsetX = newWidth * offsetX / initializeWidth;
    const newOffsetY = newHeight * offsetY / initializeHeight;

    console.log(newOffsetX, newOffsetY);

    svgElement.setAttribute('viewBox', transformViewBox(newX, newY, newWidth, newHeight));
  }

  return event;
}

const setupMousewheel = setupEventHandler(throttle(handleMousewheel, 20))('mousewheel');

// Scale stage
export const scaleCanvas = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  const root = stage.getStageNode();

  setupMousewheel(root);

  // 视域左上角定位元素 
  // 开发模式开启协助开发
  // root.children.push(h('rect', { attrs:{ x: 0, y: 0, width: 10, height: 10, fill: 'red'}, ns: 'http://www.w3.org/2000/svg',}));

  next(userState);
};