import { VNode } from '../node_modules/snabbdom/vnode';

declare type StrategyFn = (parent: VNode) => VNode;
declare type PatchFn = (userState?: any) => void;
declare type SubscriberFn = (userState?: any) => void;
declare type MiddlewareFn = (stage: Stage) => (next: PatchFn) => (userState?: any) => void;
declare type CreateStageFn = (initNode: VNode) => Stage;

declare interface Stage {
  getStageNode: () => VNode,
  create: (strategy: StrategyFn) => VNode,
  subscribe: (handler: SubscriberFn) => void,
  patch: PatchFn,
}

declare interface PositionOption {
  x?: number,
  y?: number,
  tag?: string,
}

declare interface TextOption extends PositionOption {
  content: string,
}

declare interface ImageOption extends PositionOption {
  URL: string,
  width?: number,
  height?: number,
}

declare interface CircleOption extends PositionOption {
  radius: number,
  cx: number,
  cy: number,
  fill?: string,
}

declare interface GroupOption extends PositionOption {
  className: string,
}

declare interface ImageNodeOption {
  URL: string,
  title: string,
  tag?: string,
}

declare interface ServerNodeOption {
  title: string,
  instances: string,
  color: string,
  tag?: string,
}

declare interface ServiceNodeOption extends ServerNodeOption {
  type: string,
  avgRT: string,
  rpm: string,
}

declare interface LineOption {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  strokeColor: string,
  strokeWidth: number,
  tag?: string,
}

declare interface ArrowOption {
  x: number,
  y: number,
  fill: string,
  tag?: string,
}


declare interface TopoData {

}