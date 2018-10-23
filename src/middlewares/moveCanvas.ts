import { VNode } from '../../node_modules/snabbdom/vnode';
import { Stage, PatchFn, TopoData } from '../../typings/defines';
import { setupEventHandler, Position, lerp } from '../utils';

import compose from '../compose';



// 添加拖拽移动画布功能
export const moveCanvas = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log('before move');
  const root = stage.getStageNode();
  const ref = stage.getContainer().parentElement;

  const containerHeight = ref.offsetHeight;

  let isMouseDown = false;
  let sourcePosition: Position = { x: 0, y: 0 };
  let targetPosition: Position = { x: 0, y: 0 };

  const handleMouseDown = (event: MouseEvent): MouseEvent => {
    const target = event.target as HTMLElement;
    if (target.nodeName.toUpperCase() !== 'SVG') 
      return event;

    isMouseDown = true;
    sourcePosition.x = event.pageX;
    sourcePosition.y = event.pageY;

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
    const diffY = 0; //targetPosition.y - sourcePosition.y;

    let svgElement = event.target as HTMLElement;
    while(svgElement.nodeName.toUpperCase() !== 'SVG') {
      svgElement = svgElement.parentElement;
    }

    const [x, y, width, height] = svgElement.getAttribute('viewBox').split(',').map((n: string) => +n);
    console.log(x, y, width, height)

    const ratio = 1; //800 / width;

    svgElement.setAttribute('viewBox', `${x - (diffX * ratio)}, ${y - diffY}, ${width}, ${height}`);

    return event;
  };

  const handleMouseUp = (event: MouseEvent): MouseEvent => {
    isMouseDown = false;
    return event;
  };

  const setupDragMoveHandler = compose<VNode>(
    setupEventHandler(handleMouseDown)('mousedown'),
    setupEventHandler(handleMouseMove)('mousemove'),
    setupEventHandler(handleMouseUp)('mouseup'),
  );

  setupDragMoveHandler(root);

  next(userState);

  console.log('after move');
};
