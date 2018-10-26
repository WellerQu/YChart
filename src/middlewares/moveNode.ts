import { Stage, PatchFn, TopoData, Position } from '../../typings/defines';
import { setupEventHandler, parseTranslate, toTranslate, parseViewBoxValue, bezierCurvePoint, toArrowD, } from '../utils';
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
  // const regExp: RegExp = /^M(-?\d+(?:.\d+)?),\s*(-?\d+(?:.\d+)?)\s*Q(-?\d+(?:.\d+)?),\s*(-?\d+(?:.\d+)?)\s+(-?\d+(?:.\d+)?),\s*(-?\d+(?:.\d+)?)$/igm;
  const regExp: RegExp = /M(-?\d+(?:.\d+)?),\s*(-?\d+(?:.\d+)?)\s*L(-?\d+(?:.\d+)?),\s*(-?\d+(?:.\d+)?)/igm;
  if (!regExp.test(value))
    throw new Error(`can NOT convert to path d: ${value}`);

  return [
    [+RegExp.$1, +RegExp.$2],
    [+RegExp.$3, +RegExp.$4],
    // [+RegExp.$5, +RegExp.$6],
  ];
};

// const updateArrowPosition = (arrow: SVGPathElement) => (x1: number, y1: number, x2: number, y2: number) =>

export const moveNode = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log('DOING: moveNode'); // eslint-disable-line

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

          const paths = item.querySelectorAll('path');
          const line = paths[0];
          const arrow = paths[1];

          const [[x1, y1], [x2, y2]] = parsePathD(line.getAttribute('d'));
          const x = NODE_SIZE  / 2 + newX;
          const y = NODE_SIZE  / 2 + newY;

          // update arrow
          // if (x1 === x2) {
          //   arrow.setAttribute('d', toArrowD(x1, y1 + 30));
          //   arrow.setAttribute('transform', `rotate(180, ${x1} ${y1 + 30 + 10 / 2})`);
          // } else if (y1 === y2) {
          //   arrow.setAttribute('d', toArrowD(x1 + 30, y1));
          //   arrow.setAttribute('transform', `rotate(90, ${x1 + 30} ${y1})`);
          // } else {
          //   const k = (y2 - y1) / (x2 - x1);
          //   const b = y2 - k * x2;
          //   const arrowX = x1 + 30;
          //   const arrowY = k * arrowX + b;
      
          //   arrow.setAttribute('d', toArrowD(arrowX, arrowY));
          //   arrow.setAttribute('transform', `rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90}, ${arrowX} ${arrowY})`);
          // }

          if (source === currentElementID) {
            // update start position

            line.setAttribute('d', `M${x},${y} L${x2},${y2}`);

            return;
          }

          if (target === currentElementID) {
            // update end position

            line.setAttribute('d', `M${x1},${y1} L${x},${y}`);

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

