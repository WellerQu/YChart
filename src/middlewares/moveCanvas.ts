/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

import { VNode, } from 'snabbdom/vnode';

import { Stage, PatchFn, TopoData, Position, } from '../../typings/defines';
import { setupEventHandler, parseViewBoxValue, } from '../utils';

import compose from '../compose';

// 添加拖拽移动画布功能
export const moveCanvas = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  const root = stage.getStageNode();

  let isMouseDown: boolean = false;
  let sourcePosition: Position = { x: 0, y: 0, };
  let targetPosition: Position = { x: 0, y: 0, };
  let startViewBox: string = '';

  const handleMouseDown = (event: MouseEvent): MouseEvent => {
    const target = event.target as HTMLElement;
    if (target.nodeName.toUpperCase() !== 'SVG') 
      return event;

    isMouseDown = true;
    sourcePosition.x = event.pageX;
    sourcePosition.y = event.pageY;

    startViewBox = target.getAttribute('viewBox');

    target.style.cursor = 'move';

    return event;
  };

  const handleMouseMove = (event: MouseEvent): MouseEvent => {
    if (!isMouseDown)
      return event;

    const target = event.target as HTMLElement;
    if (target.nodeName.toUpperCase() !== 'SVG') {
      return event;
    }

    targetPosition.x = event.pageX;
    targetPosition.y = event.pageY;

    const diffX = targetPosition.x - sourcePosition.x;
    const diffY = targetPosition.y - sourcePosition.y;

    let svgElement = event.target as HTMLElement;
    while(svgElement.nodeName.toUpperCase() !== 'SVG') {
      svgElement = svgElement.parentElement;
    }

    const [x1, y1,] = parseViewBoxValue(startViewBox);
    const [,, width, height,] = parseViewBoxValue(svgElement.getAttribute('viewBox'));
    const containerWidth = svgElement.parentElement.offsetWidth;
    const ratio = -(width / containerWidth);

    let newX = x1 + (diffX * ratio);
    let newY = y1 + (diffY * ratio);

    // svgElement.setAttribute('viewBox', `${xClamp(newX)}, ${yClamp(newY)}, ${width}, ${height}`);
    svgElement.setAttribute('viewBox', `${newX}, ${newY}, ${width}, ${height}`);

    return event;
  };

  const handleMouseUp = (event: MouseEvent): MouseEvent => {
    isMouseDown = false;

    let svgElement = event.target as HTMLElement;
    while(svgElement.nodeName.toUpperCase() !== 'SVG') {
      svgElement = svgElement.parentElement;
    }
    svgElement.style.cursor = 'default';

    startViewBox = svgElement.getAttribute('viewBox');

    return event;
  };

  const setupDragMoveHandler = compose<VNode>(
    setupEventHandler(handleMouseDown)('mousedown'),
    setupEventHandler(handleMouseMove)('mousemove'),
    setupEventHandler(handleMouseUp)('mouseup'),
    // setupEventHandler(handleMouseUp)('mouseout'),
  );

  setupDragMoveHandler(root);

  next(userState);
};
