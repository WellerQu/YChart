/// <reference path="../node_modules/snabbdom/vnode.d.ts" >

import { VNode, } from 'snabbdom/vnode';

export type Strategy = (parent: VNode) => VNode;
export type Component<T> = (option: T) => Strategy;
export type PatchBehavior = (userState?: any) => void;
export type Subscriber = (userState?: any) => void;
export type Middleware = (stage: Stage) => (next: PatchBehavior) => (userState?: any) => void;
export type CreateStage = (container: HTMLElement) => Stage;
export type UpdateBehavior<T> = (data: T, option?: Viewbox, merged?: boolean) => void;

/**
 * 带有三角箭头的线段配置项, 实际上就是LineOption和ArrowOption的交叉类型
 */
export type ArrowLineOption = LineOption & ArrowOption;
export type DataEventHandler = (event: Event, data: any) => void;
export type EventHandler = (event: Event) => Event;
export type Position = { x: number, y: number };
export type Size = { width: number, height: number };
export type Viewbox = Size & Position;

 declare module '*.json' {
  const value: any;
  export default value;
}

declare interface SVGOption {
  viewbox: Viewbox;
  size: Size;
}

declare interface EventOption {
  [T: string]: DataEventHandler;
}

declare interface Store {
  read<T>(key: string): T;
  write<T>(key: string, value: T): T;
}

declare interface Stage {
  stageNode: () => VNode;
  create: (strategy: Strategy) => VNode;
  subscribe: (handler: Subscriber) => void;
  patch: PatchBehavior;
  viewbox: (option?: Viewbox) => Viewbox;
  size: (option?: Size) => Size;
}

declare interface PositionOption {
  x?: number;
  y?: number;
  className?: string;
}

declare interface TextOption extends PositionOption {
  content: string;
  fill?: string;
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

declare interface RectOption extends PositionOption {
  rx?: number;
  ry?: number;
  height: number;
  width: number;
  stroke?: string;
  strokeWidth: number;
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
  elapsedTime: number;
  rpm: number;
  epm: number;
  callCount: number;
  errorCount: number;
  id?: string;
  className?: string;
}

declare interface AppNodeOption {
  id: string;
  title: string;
  type: string;
  tierCount: number;
  instances: number;
  className?: string;
}

declare interface LineOption {
  id: string,
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  L?: Position[];
  strokeColor: string;
  strokeWidth: number;
  text?: string;
  className?: string;
}

declare interface ArrowOption {
  id: string;
  x: number;
  y: number;
  height?: number;
  width?: number;
  fill: string;
  className?: string;
}

declare interface RuleOption {
  className?: string;
  min: number;
  max: number;
  step: number;
  color?: string;
  availableWidth: number;
}

declare interface CallstackOption {
  id: string;
  text: string;
  width: number;
  paddingLeft: number;
  color: string;
  className?: string;
}

// --- 以下为业务数据 ---

declare interface Node {
  readonly id: string;
  readonly name: string;
  type: string;
  smallType: string | null;
  instances: number;
  activeInstances: number;
  /**
   * 调用这个节点的Tier的集合
   */
  tiers?: TierNode[];
  /** 
   * 被当前节点代表的其他可合并节点
   */
  mysqlDatabases?: MySqlDatabase;
  /**
   * 展示用的名字
   */
  showName?: string;
  /**
   * 展示用的图标
   */
  showIcon?: string;
  apdex?: string;
  health?: string;
  callCount?: number;
  error?: number;
  elapsedTime?: number;
  rpm?: number;
  epm?: number;
  times?: number;
  totalCount?: number;
  errorTotalCount?: number;
  crossApp?: boolean;
  tiersCount?: number;

  tierId?: string;
  tierName?: string;
  appId?: string;
  appName?: string;
}

declare interface TierNode {
  tierName: string;
  elapsedTime: number;
  name: string;
}

declare interface MySqlDatabase {
  origin: any;
  protocol: string;
  domain: string;
  port: number;
  url: string;
  params?: Params[];
}

declare interface Params {
  name: string;
  value: any;
}

declare interface Line {
  source: string;
  target: string;
  elapsedTime: number;
  rpm?: number;
  counts?: number;
}

declare interface TopoData {
  nodes: Node[];
  links: Line[];
  scale?: 1;
}

declare interface CallstackData {
  spanId: string;
  appName: string;
  transactionName: string;
  elapsedTime: number;
  timeOffset: number;
  combinedCount: number;
  error: boolean;
  asyncCalled: boolean;

  showName?: string;
  isFold?: boolean;
  combined?: CallstackData[],
  indent?: number;
  fill?: string;
  children?: CallstackData[];
  parentTimeOffset?: number;
  parentId?: string;
}