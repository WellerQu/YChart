import { VNode } from '../node_modules/snabbdom/vnode';

export type StrategyFn = (parent: VNode) => VNode;
export type PatchFn = (userState?: any) => void;
export type SubscriberFn = (userState?: any) => void;
export type MiddlewareFn = (stage: Stage) => (next: PatchFn) => (userState?: any) => void;
export type CreateStageFn = (container: HTMLElement) => Stage;
export type UpdateFn = (data: TopoData) => void;
export type ArrowLineOption = LineOption & ArrowOption;

declare interface Stage {
  getStageNode: () => VNode;
  getContainer: () => HTMLElement;
  create: (strategy: StrategyFn) => VNode;
  subscribe: (handler: SubscriberFn) => void;
  patch: PatchFn;
}

declare interface SvgOption {
  width: number | string;
  height: number | string;
}

declare interface PositionOption {
  x?: number;
  y?: number;
  className?: string;
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
  id?: string;
}

declare interface ImageNodeOption {
  URL: string;
  title: string;
  className?: string;
  id?: string;
}

declare interface ServiceNodeOption {
  title: string;
  instances: string;
  color: string;
  type: string;
  avgRT: number;
  rpm: number;
  epm: number;
  id?: string;
  className?: string;
}

declare interface LineOption {
  id: string,
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeColor: string;
  strokeWidth: number;
  text?: string;
  className?: string;
}

declare interface ArrowOption {
  id: string,
  x: number;
  y: number;
  fill: string;
  className?: string;
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
  showName?: string;
  showIcon?: string;
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
