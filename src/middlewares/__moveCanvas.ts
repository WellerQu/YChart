/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';

import { Stage, PatchBehavior, TopoData, Position, } from '../../typings/defines';
import { setupEventHandler, parseViewBoxValue, } from '../utils';

import compose from '../compose';
import { TOPO_OPERATION_STATE, } from '../constants/constants';

/**
 * 添加拖拽移动画布功能
 * 注意此中间件务必添加在所有布局中间件之后
 */ 
export const moveCanvas = (getState: () => number) => (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  if (!userState)
    return next(userState);

  const root = stage.stageNode();

  let isMouseDown: boolean = false;
  let sourcePosition: Position = { x: 0, y: 0, };
  let targetPosition: Position = { x: 0, y: 0, };
  let startViewBox: number[] = [0, 0, 0, 0,];

  const handleMouseDown = (event: MouseEvent): MouseEvent => {
    if (getState() !== TOPO_OPERATION_STATE.CAN_MOVE_CANVAS) return event;

    const target = event.target as HTMLElement;
    if (target.nodeName.toUpperCase() !== 'SVG') 
      return event;

    isMouseDown = true;
    sourcePosition.x = event.pageX;
    sourcePosition.y = event.pageY;

    startViewBox = parseViewBoxValue(target.getAttribute('viewBox'));

    target.style.cursor = 'move';

    return event;
  };

  const handleMouseMove = (event: MouseEvent): MouseEvent => {
    if (!isMouseDown)
      return event;

    let target = event.target as HTMLElement;
    if (target.nodeName.toUpperCase() !== 'SVG') 
      return event;

    targetPosition.x = event.pageX;
    targetPosition.y = event.pageY;

    const diffX = targetPosition.x - sourcePosition.x;
    const diffY = targetPosition.y - sourcePosition.y;

    const [x1, y1, width, height,] = startViewBox;
    const containerWidth = target.parentElement.offsetWidth;
    const ratio = -(width / containerWidth);

    let newX = x1 + (diffX * ratio);
    let newY = y1 + (diffY * ratio);

    target.setAttribute('viewBox', `${newX}, ${newY}, ${width}, ${height}`);

    return event;
  };

  const handleMouseUp = (event: MouseEvent): MouseEvent => {
    let target = event.target as HTMLElement;
    if (target.nodeName.toUpperCase() === 'SVG') {
      isMouseDown = false;
      target.style.cursor = 'default';
    }

    return event;
  };

  const setupDragMoveHandler = compose<VNode>(
    setupEventHandler(handleMouseDown)('mousedown'),
    setupEventHandler(handleMouseMove)('mousemove'),
    setupEventHandler(handleMouseUp)('mouseup'),
    setupEventHandler(handleMouseUp)('mouseout'),
  );

  setupDragMoveHandler(root);

  next(userState);
};
