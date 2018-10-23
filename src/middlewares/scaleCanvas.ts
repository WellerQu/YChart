import { Stage, PatchFn, TopoData } from '../../typings/defines';
import { setupEventHandler, throttle, clamp, parseViewBoxValue } from '../utils';

const widthClamp = clamp(320, 2420);
const heightClamp = clamp(160, 1210);

const handleMousewheel = (event: MouseWheelEvent): MouseEvent => {
  let svgElement = event.target as HTMLElement;
  while(svgElement.nodeName.toUpperCase() !== 'SVG') {
    svgElement = svgElement.parentElement;
  }

  const [x, y, width, height] = parseViewBoxValue(svgElement.getAttribute('viewBox'));
  const ratio = width / height;
  const diffWidth = 20;
  const diffHeight = diffWidth / ratio; 

  const originX = event.clientX - svgElement.parentElement.offsetLeft;
  const originY = event.clientY - svgElement.parentElement.offsetTop;

  const initializeWidth = svgElement.parentElement.offsetWidth;

  if (event.deltaY > 0) {
    const actualWidth = widthClamp(width - diffWidth);
    const actualHeight = heightClamp(height - diffHeight);
    const ratio = actualWidth / initializeWidth  - 1;

    svgElement.setAttribute('viewBox', `${-ratio * originX}, ${-ratio * originY}, ${actualWidth}, ${actualHeight}`);
  } else if (event.deltaY < 0) {
    const actualWidth = widthClamp(width + diffWidth);
    const actualHeight = heightClamp(height + diffHeight);
    const ratio = actualWidth / initializeWidth  - 1;

    svgElement.setAttribute('viewBox', `${-ratio * originX}, ${-ratio * originY}, ${actualWidth}, ${actualHeight}`);
  }

  return event;
}

const setupMousewheel = setupEventHandler(throttle(handleMousewheel, 16))('mousewheel');

// Scale stage
export const scaleCanvas = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  const root = stage.getStageNode();

  setupMousewheel(root);

  next(userState);
};