import { VNode } from '../../node_modules/snabbdom/vnode';
import { Stage, PatchFn, TopoData } from '../../typings/defines';
import { setupEventHandler, Position, parseViewBoxValue, } from '../utils';

import compose from '../compose';

// 添加拖拽移动画布功能
export const moveCanvas = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  const root = stage.getStageNode();

  let isMouseDown = false;
  let sourcePosition: Position = { x: 0, y: 0 };
  let targetPosition: Position = { x: 0, y: 0 };
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
    const target = event.target as HTMLElement;
    if (target.nodeName.toUpperCase() !== 'SVG') 
      return event;

    if (!isMouseDown)
      return event;

    targetPosition.x = event.pageX;
    targetPosition.y = event.pageY;

    const diffX = targetPosition.x - sourcePosition.x;
    const diffY = targetPosition.y - sourcePosition.y;

    let svgElement = event.target as HTMLElement;
    while(svgElement.nodeName.toUpperCase() !== 'SVG') {
      svgElement = svgElement.parentElement;
    }

    const [x1, y1] = parseViewBoxValue(startViewBox);
    const [x2, y2, width, height] = parseViewBoxValue(svgElement.getAttribute('viewBox'));
    const ratio = (width / 800);
    let actualX = x1 + (diffX * -ratio);
    let actualY = y1 + (diffY * -ratio);

    svgElement.setAttribute('viewBox', `${actualX}, ${actualY}, ${width}, ${height}`);

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
    setupEventHandler(handleMouseUp)('mouseout'),
  );

  setupDragMoveHandler(root);

  next(userState);
};
