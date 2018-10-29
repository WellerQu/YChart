import { VNode } from 'snabbdom/vnode';
import { EventHandler, Position } from '../typings/defines';
export declare const setupEventHandler: (handler: EventHandler) => (eventName: string) => (vnode: VNode) => VNode;
export declare const throttle: (handler: EventHandler, gapTime: number) => (event: Event) => Event;
export declare function memory<T>(fn: (...args: any[]) => T, resolver?: (...args: any[]) => string): (...args: any[]) => T;
export declare const clamp: (min: number, max: number) => (value: number) => number;
export declare const parseViewBoxValue: (value: string) => number[];
export declare const parseTranslate: (value: string) => Position;
export declare const toViewBox: (x: number, y: number, width: number, height: number) => string;
export declare function toTranslate(x: number, y: number): string;
export declare function toTranslate(position: Position): string;
export declare const toArrowD: (x: number, y: number, width?: number, height?: number) => string;
export declare const max: (...nums: number[]) => number;
export declare const imagePath: (iconName: string) => string;
