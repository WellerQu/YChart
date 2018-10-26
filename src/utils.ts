import { VNode } from '../node_modules/snabbdom/vnode';
import compose from './compose';
import { EventHandler, Position } from '../typings/defines';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';

export const setupEventHandler = (handler: EventHandler) => (eventName: string) => (vnode: VNode) => {
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
  return function(event: MouseEvent): MouseEvent {
    let nowTime = +new Date;
    if (nowTime - lastTime > gapTime) {
      lastTime = nowTime;
      return handler(event);
    }

    return event;
  };
};

export function memory<T>(fn: (...args: any[]) => T, resolver?: (...args: any[]) => string)  {
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
    throw new Error(`can NOT convert to Position: ${value}`);
  
  return {
    x: +RegExp.$1,
    y: +RegExp.$3,
  };
};

export const toViewBox = (x: number, y: number, width: number, height: number): string => `${x},${y},${width},${height}`;

export function toTranslate(x: number, y: number): string;
export function toTranslate(position: Position): string;
export function toTranslate(...args: any[]): string {
  if (args.length > 1) {
    const [ x, y ] = args;
    return `translate(${x}px, ${y}px)`;
  }
  
  if (args.length === 1) {
    const { x, y } = args[0];
    return `translate(${x}px, ${y}px)`;
  }

  return `translate(${0}px, ${0}px)`;
}

export function bezierCurvePoint(x1: number, y1: number, x2: number, y2: number): Position {
  if (x1 === x2) {
    return {
      x: x1- 100,
      y: (y2 - y1) / 2 + y1,
    };
  } 

  if (y1 === y2) {
    return {
      x: (x2 - x1)/ 2 + x1,
      y: y1 - 100,
    };
  } 
  
  // 已知一阶Bézier曲线的起始点P1(x1, y1)和终止点P2(x2, y2), 求控制点P
  // 设P1,P2所在线段中心点为P3(centerX, centerY)
  // 则有
  const centerX = (x2 - x1) / 2 + x1;
  const centerY = (y2 - y1) / 2 + y1;
  // 设直线方程L1, L2相互垂直, P1,P2,P3都是L1上的点, 且L1,L2相交于P3
  // 那么L1的斜率有
  const k1 = (y2 - y1) / (x2 - x1);
  // 由两线垂直则斜率互为倒数, 可知L2的斜率
  const k2 = 1 / k1;
  // 已知直线方程为Ax + By + C = 0, 那么另一条垂线的方程为k2*x + b - k2 * a = y
  // 所以代入P3则有k2 * x + centerY - k2 * centerX = y
  // 设x为一个任意值x1 + 50, 则有y = k2 * (x1 + 50) + centerY - k2 * centerX
  const x = x1 + (x2 - x1) / 2;
  const y = k2 * x + centerY - k2 * centerX; 

  return { x, y };
}

export const toArrowD = (x: number, y: number, width = ARROW_WIDTH, height = ARROW_HEIGHT): string => {
  return `M${x},${y - height / 2} L${x - width / 2},${y + height / 2} L${x + width / 2},${y + height / 2} Z`;
};


export const max = (...nums: number[]): number => {
  const [ head, ...tail ] = nums;
  const _max = (x: number) => (y: number) => x > y ? x : y;
  const getResult = compose<number>(...tail.map((n: number) => _max(n)));
  return getResult(head);
};