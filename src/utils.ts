/// <reference path="../node_modules/snabbdom/vnode.d.ts" />

import { VNode } from 'snabbdom/vnode';

import compose from './compose';
import { EventHandler, Position } from '../typings/defines';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';

export const setupEventHandler = (handler: EventHandler) => (eventName: string) => (vnode: VNode): VNode => {
  // click事件需要特殊处理, 否则服无法区分是拖拽还是点击
  // 判定标注: 
  // 1. 如果按下鼠标后抬起鼠标时的位置x轴或y轴超过3个像素的位移认为是拖拽, 否则是点击
  // 2. 如果按下鼠标后抬起鼠标时的时间间隔超过100毫秒认为是拖拽, 否则是点击
  if (eventName === 'click') {
    const OFFSET = 10;
    const GAP = 200;
    const startPosition: Position = { x: 0, y: 0 };

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

  return function(event: Event): Event {
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

export const toViewBox = (x: number, y: number, width: number, height: number): string => 
  `${x},${y},${width},${height}`;

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

export const toArrowD = (x: number, y: number, width = ARROW_WIDTH, height = ARROW_HEIGHT): string => {
  return `M${x},${y - height / 2} L${x - width / 2},${y + height / 2} L${x + width / 2},${y + height / 2} Z`;
};


export const max = (...nums: number[]): number => {
  const [ head, ...tail ] = nums;
  const _max = (x: number) => (y: number) => x > y ? x : y;
  const getResult = compose<number>(...tail.map((n: number) => _max(n)));
  return getResult(head);
};

export const imagePath = (iconName: string) => `/static/images/${iconName}.png`;