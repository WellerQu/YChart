import { Stage, PatchFn, TopoData, Position } from '../../typings/defines';
import { setupEventHandler, parseTranslate, toTranslate, parseViewBoxValue, toArrowD, } from '../utils';
import compose from '../compose';
import { VNode } from '../../node_modules/snabbdom/vnode';
import { NODE_TYPE } from '../NODE_TYPE';
import { NODE_SIZE, ARROW_OFFSET, } from '../constants';

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

      const [,, width] = parseViewBoxValue(svgElement.getAttribute('viewBox'));
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


          let startX: number, startY: number, endX: number, endY: number;
          if (source === currentElementID) {
            // update start position
            startX = x;
            startY = y;
            endX = x2;
            endY = y2;

            line.setAttribute('d', `M${x},${y} L${x2},${y2}`);
          } else if (target === currentElementID) {
            // update end position
            startX = x1;
            startY = y1;
            endX = x;
            endY = y;

            arrow.setAttribute('d', toArrowD(x1, y1));
            line.setAttribute('d', `M${x1},${y1} L${x},${y}`);
          }

          if (startX) {
            // update arrow
            const lA = endY - startY;
            const lB = endX - startX;
            const lC = Math.sqrt(Math.pow(lA, 2) + Math.pow(lB, 2));

            const lc = ARROW_OFFSET;
            const la = lc * lA / lC;
            const lb = lc * lB / lC;

            const arrowX = lb + startX;
            const arrowY = la + startY;

            arrow.setAttribute('d', toArrowD(arrowX, arrowY));

            // atan2使用的坐标系0度在3点钟方向, rotate使用的坐标系0度在12点钟方向, 相差90度
            const a = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI + 90; // 阿尔法a
            arrow.setAttribute('transform', `rotate(${a}, ${arrowX} ${arrowY})`);
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

