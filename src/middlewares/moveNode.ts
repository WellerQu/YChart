import { Stage, PatchFn, TopoData, Position } from '../../typings/defines';
import { setupEventHandler, parseTranslate, toTranslate, parseViewBoxValue, } from '../utils';
import compose from '../compose';
import { VNode } from '../../node_modules/snabbdom/vnode';
import { NODE_TYPE } from '../NODE_TYPE';
import { NODE_SIZE } from '../constants';

const findGroup = (event: Event): HTMLElement => {
  let element = event.target as HTMLElement;

  if (!element.nodeName) 
    return null;

  while (element.nodeName.toUpperCase() !== 'G' && element.nodeName.toUpperCase() !== 'SVG') {
    element = element.parentElement;
  }

  if (!element.classList.contains(NODE_TYPE.NODE)) 
    return null;

  return element;
};

const parsePathD = (value: string):([[number, number], [number, number]] | never) => {
  const regExp: RegExp = /^M(\d+(?:.\d+)?),\s*(\d+(?:.\d+)?)\s*Q(\d+(?:.\d+)?),\s*(\d+(?:.\d+)?)\s+(\d+(?:.\d+)?),\s*(\d+(?:.\d+)?)$/igm;
  if (!regExp.test(value))
    throw new Error(`can NOT convert to path d: ${value}`);

  return [
    [+RegExp.$1, +RegExp.$2],
    [+RegExp.$5, +RegExp.$6],
  ];
}

export const moveNode = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log('DOING: moveNode');

  const root = stage.getStageNode();

  let isMouseDown: boolean = false;
  let sourcePosition: Position = { x: 0, y: 0 };
  let targetPosition: Position = { x: 0, y: 0 };
  let targetElement: HTMLElement = null;

  const handleMouseDown = (event: MouseEvent): MouseEvent => {
    targetElement = findGroup(event);
    if (!targetElement)
      return event;
 
    isMouseDown = true;
    sourcePosition.x = event.pageX;
    sourcePosition.y = event.pageY;

    const position = parseTranslate(targetElement.style.transform);
    targetPosition.x = position.x;
    targetPosition.y = position.y;

    return event;
  };

  const handleMouseMove = (event: MouseEvent): MouseEvent => {
    if (!isMouseDown) 
      return event;

    let svgElement = event.target as HTMLElement;
    while(svgElement.nodeName.toUpperCase() !== 'SVG') {
      svgElement = svgElement.parentElement;
    }
 
    if (targetElement) {
      // re-compute the node position
      const diffX = event.pageX - sourcePosition.x;
      const diffY = event.pageY - sourcePosition.y;

      const [x2, y2, width] = parseViewBoxValue(svgElement.getAttribute('viewBox'));
      const containerWidth = svgElement.parentElement.offsetWidth;
      const ratio = (width / containerWidth);
      const newX = targetPosition.x + diffX * ratio;
      const newY = targetPosition.y + diffY * ratio;

      targetElement.style.transform = toTranslate(newX, newY);

      // re-draw those line-related
      const currentElementID = targetElement.id;

      Array.from(targetElement.parentElement.children)
        .filter((item: SVGGElement) => {
          if (!item.classList.contains(NODE_TYPE.LINE))
            return false;

          const [source, target] = item.id.split('-');

          return source === currentElementID || target === currentElementID;
        })
        .forEach((item: SVGGElement) => {
          const [source, target] = item.id.split('-');
          const path = item.querySelector('path') as SVGPathElement;
          const circle = item.querySelector('circle');

          const [[x1, y1], [x2, y2]] = parsePathD(path.getAttribute('d'));
          const x = NODE_SIZE / 2 + 20 + newX;
          const y = NODE_SIZE / 2 + newY;

          if (source === currentElementID) {
            // 更改起始位置
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            path.setAttribute('d', `M${x},${y} Q${0},${0} ${x2},${y2}`)
            return;
          }

          if (target === currentElementID) {
            path.setAttribute('d', `M${x1},${y1} Q${0},${0} ${x},${y}`)
            // 更改结束位置
            return;
          }
        });
    }

    return event;
  };

  const handleMouseUp = (event: MouseEvent): MouseEvent => {
    isMouseDown = false;
    targetElement = null;
    return event;
  };

  const setupDragMoveNodeHandler = compose<VNode>(
    setupEventHandler(handleMouseDown)('mousedown'),
    setupEventHandler(handleMouseMove)('mousemove'),
    setupEventHandler(handleMouseUp)('mouseup'),
    // setupEventHandler(handleMouseUp)('mouseout'),
  );

  setupDragMoveNodeHandler(root);

  next(userState);
};

