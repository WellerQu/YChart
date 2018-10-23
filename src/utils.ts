import { VNode } from '../node_modules/snabbdom/vnode';
import compose from './compose';

export type EventHandler = (event: MouseEvent) => MouseEvent;
export type Position = { x: number, y: number };

export const setupEventHandler = (handler: (event: MouseEvent) => MouseEvent) => (eventName: string) => (vnode: VNode) => {
  if (!vnode.data.on) {
    vnode.data.on = {};
  }

  if (vnode.data.on[eventName]) {
    vnode.data.on[eventName] = compose<void>(vnode.data.on.mouseenter, handler);
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
  }
};

export const clamp = (min: number, max: number) => (value: number) => {
  return value < min ? min : value > max ? max : value;
};

export const lerp = (source: Position, target: Position) => ({
  x: (target.x - source.x) * .01,
  y: (target.y - source.y) * .01,
});