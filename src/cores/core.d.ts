import { VNode, } from 'snabbdom/vnode';
import { TOPO_OPERATION_STATE, } from '../constants/constants';

interface Functor {
  map: (f: Function) => Functor;
  fold: (f: Function) => any;
  ap: (f: Functor) => Functor;
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

type Viewbox = [number, number, number, number];
type StrategyID = (parent: VNode) => VNode;
type Middleware = (instance: InstanceAPI) => (next: PatchBehavior) => (x: any) => void;
type PatchBehavior = (userState?: any) => void;
type CreateComponent = (option: any) => VNode;

interface ChartOption {
  size: Size;
  viewbox: Viewbox;
  container: HTMLElement;
}

interface TopoData {

}

interface CallstackData {

}

interface InstanceAPI {
  update: (strategy: StrategyID) => VNode;
  patch: () => void;
  destroy: () => void;
  reset: () => void;
  viewbox: (value?: Viewbox) => Viewbox;
  size: (value?: Size) => Size;
  scale: (value?: number) => number;
  operation: (value?: TOPO_OPERATION_STATE) => TOPO_OPERATION_STATE,
  getStage: () => VNode;
}

interface Creator<S, T> {
  of: (option?: S) => T;
}

interface InstanceCreator extends Creator<ChartOption, InstanceAPI> {
  (option?: ChartOption): InstanceAPI;
}

interface TextOption extends Position, ComponentOption {
  content: string;
}

interface GroupOption extends Position, ComponentOption {
  id: string;
}

interface SvgOption {
  viewbox: Viewbox; 
  size: Size;
}