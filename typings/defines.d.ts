import { VNode } from '../node_modules/snabbdom/vnode';

export type StrategyFn = (parent: VNode) => VNode;
export type PatchFn = (userState?: any) => void;
export type SubscriberFn = (userState?: any) => void;
export type MiddlewareFn = (stage: Stage) => (next: PatchFn) => (userState?: any) => void;
export type CreateStageFn = (initNode: VNode) => Stage;
export type UpdateFn = (data: TopoData) => void;

declare interface Stage {
  getStageNode: () => VNode;
  create: (strategy: StrategyFn) => VNode;
  subscribe: (handler: SubscriberFn) => void;
  patch: PatchFn;
}

declare interface PositionOption {
  x?: number;
  y?: number;
  tag?: string;
}

declare interface TextOption extends PositionOption {
  content: string;
}

declare interface ImageOption extends PositionOption {
  URL: string;
  width?: number;
  height?: number;
}

declare interface CircleOption extends PositionOption {
  radius: number;
  cx: number;
  cy: number;
  fill?: string;
}

declare interface GroupOption extends PositionOption {
  className: string;
}

declare interface ImageNodeOption {
  URL: string;
  title: string;
  tag?: string;
}

declare interface ServerNodeOption {
  title: string;
  instances: string;
  color: string;
  tag?: string;
}

declare interface ServiceNodeOption extends ServerNodeOption {
  type: string;
  avgRT: string;
  rpm: string;
}

declare interface LineOption {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeColor: string;
  strokeWidth: number;
  tag?: string;
}

declare interface ArrowOption {
  x: number;
  y: number;
  fill: string;
  tag?: string;
}

declare interface Node {
  id: string;
  name: string;
  times: number;
  type: string;
  smallType: string | null;
  instances: number;
  activeInstances: number;
  elapsedTime: number;
  rpm: number;
  epm: number;
  health: string | null;
  totalCount: number;
  errorTotalCount: number;
  crossApp: boolean;
  showName?: string,
}

declare interface Line {
  source: string;
  target: string;
  elapsedTime: number;
  rpm: number;
}

declare interface TopoData {
  nodes: Node[];
  links: Line[];
}
