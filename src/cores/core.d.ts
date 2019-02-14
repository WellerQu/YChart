import { VNode, } from 'snabbdom/vnode';
import { TOPO_OPERATION_STATE, TOPO_LAYOUT_STATE, } from '../constants/constants';

interface Functor {
  readonly __value__?: any;
  map: (f: Function) => Functor;
  fold: (...f: Function[]) => any;
  ap: (f: Functor) => Functor;
  chain: (f: Function) => Functor,
}

interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface ComponentOption {
  className?: Record<string, boolean>,
}

interface StrategyID {
  (parent: VNode): VNode
}

interface PatchBehavior {
  (userState?: any): void; 
}

interface UpdateBehavior {
  (strategy: StrategyID): VNode;
}

interface EventHandler {
  (event: Event): Event;
}

type Viewbox = [number, number, number, number];
type Middleware = (instance: InstanceAPI) => (next: PatchBehavior) => (userState?: any) => void;

interface ChartOption {
  size: Size;
  viewbox: Viewbox;
  container: HTMLElement;
}

interface InstanceAPI {
  update: UpdateBehavior;
  patch: (userState?: any) => void;
  destroy: () => void;
  reset: () => void;
  viewbox: (value?: Viewbox) => Viewbox;
  size: (value?: Size) => Size;
  getStage: () => VNode;
}

interface InstanceState extends InstanceAPI {
  scale: (value?: number) => number;
  operation: (value?: TOPO_OPERATION_STATE) => TOPO_OPERATION_STATE,
  layout: (value?: TOPO_LAYOUT_STATE) => TOPO_LAYOUT_STATE,
  addEventListener: (eventName: string, callback: Function) => void;
  removeEventListener: (eventName: string, callback?: Function) => void;
}

interface Creator<S, T> {
  of: (option?: S) => T;
}

interface InstanceCreator {
  (option?: ChartOption): InstanceAPI;
}

interface StateCreator {
  (option?: ChartOption): InstanceState;
}

interface TextOption extends Position, ComponentOption {
  content: string;
}

interface CircleOption extends Position, ComponentOption {
  radius: number;
  fill: string;
}

interface GroupOption extends Position, ComponentOption {
  id: string;
}

interface ImageOption extends Position {
  URL: string;
  width?: number;
  height?: number;
}

interface SvgOption {
  viewbox: Viewbox; 
  size: Size;
}

interface ApplicationOption extends ComponentOption {
  id: string;
  title: string;
  tierCount?: number;
  instancesCount?: number;
}

interface ServiceOption extends ComponentOption {
  id: string;
  title: string;
  fill: string;
  type: string;
  activeInstanceCount: number;
  instanceCount: number;
  callCount?: number;
  errorCount?: number;
  elapsedTime?: number;
  rpm?: number;
  epm?: number;
}

interface UserOption extends ComponentOption {
  id: string;
}

interface LineOption extends ComponentOption {
  id: string;
  source: Position; 
  target: Position;
  text?: string;
}

interface ArrowOption extends LineOption {
  middle: Position,
}

interface CallstackData {

}

interface TopoData {
  nodes: Node[],
  links: Line[],
}

interface Node {
  readonly id: string;
  readonly name: string;
  type: string;
  smallType: string | null;
  instances: number;
  activeInstances: number;
  /**
   * 调用这个节点的Tier的集合
   */
  tiers?: Tier[];
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
}

interface Line {
  source: string;
  target: string;
  elapsedTime?: number;
}

interface MySqlDatabase {
  origin: any;
  protocol: string;
  domain: string;
  port: number;
  url: string;
  params?: { name: string; value: any; }[];
}

interface Tier {
  tierName: string;
  elapsedTime: number;
  name: string;
}