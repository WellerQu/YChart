/// <reference path="../node_modules/snabbdom/vnode.d.ts" />

import { VNode, } from 'snabbdom/vnode';

import compose from './compose';
import { EventHandler, } from '../typings/defines';
import { ARROW_HEIGHT, ARROW_WIDTH, NODE_SIZE, ARROW_OFFSET, NODE_TYPE, } from './constants/constants';
import { Size, Position, } from './cores/core';

export const isNull = (value: any): boolean => {
  if (value === null)
    return true;
  if (value === void 0)
    return true;

  return false;
};


/**
 * 将VNode集合按照类型分为Node集合, Line集合, 其他集合
 * @param collection VNode集合
 * @returns
 */
export function group (collection: VNode[]): [VNode[], VNode[], VNode[]] {
  const lines: VNode[] = [];
  const nodes: VNode[] = [];
  const rests: VNode[] = [];

  if (!collection || collection.length === 0)
    return [lines, nodes, rests,];

  for (let i = 0, len = collection.length; i < len; i++) {
    const item = collection[i];

    if (!item.data || !item.data.class)
      continue;

    if (item.data.class[NODE_TYPE.NODE]) {
      nodes.push(item);
      continue;
    }
    if (item.data.class[NODE_TYPE.LINE]) {
      lines.push(item);
      continue;
    }

    rests.push(item);
  }

  return [lines, nodes, rests,];
}

export const setupEventHandler = (handler: EventHandler) => (eventName: string) => (vnode: VNode): VNode => {
  // click事件需要特殊处理, 否则服无法区分是拖拽还是点击
  // 判定标注: 
  // 1. 如果按下鼠标后抬起鼠标时的位置x轴或y轴超过3个像素的位移认为是拖拽, 否则是点击
  // 2. 如果按下鼠标后抬起鼠标时的时间间隔超过100毫秒认为是拖拽, 否则是点击
  if (eventName === 'click') {
    const OFFSET = 10;
    const GAP = 200;
    const startPosition: Position = { x: 0, y: 0, };

    let startTime: number = 0;

    const setupClickHandler = compose<VNode>(
      setupEventHandler((event: Event) => {
        const mouseEvent = event as MouseEvent;
        startPosition.x = mouseEvent.clientX;
        startPosition.y = mouseEvent.clientY;
        startTime = +new Date;
        return event;
      })('mousedown'),
      setupEventHandler((event: Event) => {
        const mouseEvent = event as MouseEvent;
        const now = +new Date;
        if (Math.abs(mouseEvent.clientX - startPosition.x) < OFFSET 
          && Math.abs(mouseEvent.clientY - startPosition.y) < OFFSET 
          && now - startTime < GAP) {
          return handler(event);
        }

        return event;
      })('mouseup'),
    );

    return setupClickHandler(vnode);
  }

  if (!vnode.data.on) {
    vnode.data.on = {};
  }

  if (vnode.data.on[eventName]) {
    vnode.data.on[eventName] = compose<void>(vnode.data.on[eventName], handler);
  } else {
    vnode.data.on[eventName] = handler;
  }

  return vnode;
};

export const throttle = (handler: EventHandler, gapTime: number) => {
  let lastTime: number = 0;

  return function (event: Event): Event {
    let nowTime = +new Date;
    if (nowTime - lastTime > gapTime) {
      lastTime = nowTime;
      return handler(event);
    }

    return event;
  };
};

export function memory<T> (fn: (...args: any[]) => T, resolver?: (...args: any[]) => string)  {
  const memories = new Map<string, T>();

  return (...args: any[]): T => {
    const key: string = resolver ? resolver(...args) : args[0];
    const result: T = memories.get(key);

    if (!result)
      return memories.set(key, fn(...args)).get(key);
    
    return result;
  };
}

export const clamp = (min: number, max: number) => (value: number) => {
  return value < min ? min : value > max ? max : value;
};

export const parseViewBoxValue = (value: string): number[] => value.split(',').map(n => +n);

export const parseTranslate = (value: string): ( Position | never) => {
  const regExp = /^translate\((-?\d+(\.\d+)?)px,\s*(-?\d+(\.\d+)?)px\)$/igm;
  if (!regExp.test(value))
    // throw new Error(`can NOT convert to Position: ${value}`);
    return { x: 0, y: 0, };
  
  return {
    x: +RegExp.$1,
    y: +RegExp.$3,
  };
};

export const toViewBox = (x: number, y: number, width: number, height: number): string => 
  `${x},${y},${width},${height}`;

export function toTranslate(x: number, y: number): string;
export function toTranslate(position: Position): string;
export function toTranslate (...args: any[]): string {
  if (args.length > 1) {
    const [ x, y, ] = args;
    return `translate(${x}px, ${y}px)`;
  }
  
  if (args.length === 1) {
    const { x, y, } = args[0];
    return `translate(${x}px, ${y}px)`;
  }

  return `translate(${0}px, ${0}px)`;
}

export const toArrowD = (x: number, y: number, width = ARROW_WIDTH, height = ARROW_HEIGHT): string => {
  return `M${x},${y - height / 2} L${x - width / 2},${y + height / 2} L${x + width / 2},${y + height / 2} Z`;
};

export const max = (...nums: number[]): number => {
  if (!nums) return 0;
  if (nums.length === 1) return nums[0];

  const [ head, ...tail ] = nums;
  const _max = (x: number) => (y: number) => x > y ? x : y;
  const getResult = compose<number>(...tail.map((n: number) => _max(n)));
  return getResult(head);
};

export const imagePath = (iconName: string) => `/static/images/${iconName}.png`;

export const findGroup = (event: Event): HTMLElement => {
  const findG = findElement('G');
  const gElement = findG(event.target as HTMLElement);
  
  return (gElement && gElement.classList.contains(NODE_TYPE.NODE)) ? gElement : null;
};

export const findRoot = (event: Event): HTMLElement => {
  const findSVG = findElement('SVG');
  return findSVG(event.target as HTMLElement);
};

export const findElement = (tagName: string) => (element: HTMLElement): HTMLElement => {
  if (!element)
    return null;

  if (tagName === element.nodeName.toUpperCase())
    return element;

  return findElement(tagName)(element.parentElement);
};

export function updateLinePosition (item: VNode, start: Position, end: Position): VNode;
export function updateLinePosition (item: VNode, start: Position, end: Position): VNode {
  const line: VNode = item.children[0] as VNode;
  const arrow: VNode = item.children[1] as VNode;
  const text: VNode = item.children[2] as VNode;

  const x1 = start.x + NODE_SIZE / 2;
  const y1 = start.y + NODE_SIZE / 2;
  const x2 = end.x + NODE_SIZE / 2;
  const y2 = end.y + NODE_SIZE / 2;

  if (y2 === y1 && x2 === x1)
    return item;

  // update arrow
  if (arrow) {
    const lA = y2 - y1;
    const lB = x2 - x1;
    const lC = Math.sqrt(Math.pow(lA, 2) + Math.pow(lB, 2));

    const lc = ARROW_OFFSET;
    const la = (lc * lA) / lC;
    const lb = (lc * lB) / lC;

    const arrowX = lb + x1;
    const arrowY = la + y1;

    arrow.data.attrs.d = toArrowD(arrowX, arrowY);

    // atan2使用的坐标系0度在3点钟方向, rotate使用的坐标系0度在12点钟方向, 相差90度
    const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI + 90; // 阿尔法a
    arrow.data.attrs.transform = `rotate(${a}, ${arrowX} ${arrowY})`;
  }

  // update text position
  if (text) {
    text.data.attrs.x = (x2 - x1) / 2 + x1;
    text.data.attrs.y = (y2 - y1) / 2 + y1;
  }

  // link line
  if (line) {
    line.data.attrs.d = `M${x1},${y1} L${x2},${y2}`;
  }

  return item;
}

export function graph (stage: VNode): (Position & Size) {
  const children = stage.children as ( VNode | string )[];


  // 初始化偏移
  const nodes = children.filter((item: (VNode | string)) => {
    const node = item as VNode;
    if (node.data && node.data.class && node.data.class[NODE_TYPE.NODE])
      return true;

    return false;
  });

  if (nodes.length < 2) return { x: 0, y: 0, width: 0, height: 0, };
  const [head, ...tail] = nodes;

  const first = parseTranslate((head as VNode).data.style.transform);
  let minimumX = first.x, minimumY = first.y, maximumX = first.x, maximumY = first.y;

  tail.forEach((node: VNode) => {
    const position = parseTranslate(node.data.style.transform);

    minimumX = Math.min(minimumX, position.x);
    minimumY = Math.min(minimumY, position.y);
    maximumX = Math.max(maximumX, position.x);
    maximumY = Math.max(maximumY, position.y);
  });

  maximumX += NODE_SIZE;
  maximumY += NODE_SIZE;

  // 计算拓扑图整体所在最小矩形
  const graphWidth = maximumX - minimumX;
  const graphHeight = maximumY - minimumY;

  return {
    x: minimumX,
    y: minimumY,
    width: graphWidth,
    height: graphHeight,
  }; 
}