import { InstanceAPI, PatchBehavior, TopoData, Size, Position, InstanceState, } from '../cores/core';
import functor from '../cores/functor';
import { VNode, } from 'snabbdom/vnode';
import sideEffect from '../cores/sideEffect';
import id from '../cores/id';
import { NODE_SIZE, TOPO_LAYOUT_STATE, NODE_TYPE, } from '../constants/constants';
import { toTranslate, } from '../utils';

/**
 * @module middlewares
 */

// 求容器的中心点
const centerPositionOfContainer = (size: Size) => ({
  x: size.width / 2,
  y: size.height / 2,
});

// 求合适的半径
const circleRadius = (size: Size) =>
  Math.max(size.width, size.height) / 2 - NODE_SIZE * 2;

// 求节点的中心点
const centerPositionOfShape = (pos: Position) =>
  ({ x: pos.x - NODE_SIZE / 2, y: pos.y - NODE_SIZE / 2,});

/**
 * 拓扑图布局策略 - 环形布局
 */
export default (instance: InstanceState) => (next: PatchBehavior) => (userState: TopoData) => {
  if (instance.layout() !== TOPO_LAYOUT_STATE.CIRCLE)
    return next(userState);
  
  console.log('applied circle layout strategy'); // eslint-disable-line

  const size$ = functor(instance).map((ins: InstanceAPI) => ins.size());
  const center$ = size$.map(centerPositionOfContainer);
  const radius$ = size$.map(circleRadius);
  const circlePosition$ = functor((center: Position) => (radius: number) => (deg: number) => ({
    x: Math.sin(deg * Math.PI / 180) * radius + center.x,
    y: Math.cos(deg * Math.PI / 180) * radius + center.y,
  }))
    .ap(center$)
    .ap(radius$);

  functor(instance)
    .map((ins: InstanceAPI) => ins.getStage())
    .map(($stage: VNode) => $stage.children)
    .map((children: VNode[]) => children.filter(n => n.data.class))
    .map((children: VNode[]) => children.filter(n => n.data.class[NODE_TYPE.NODE]))
    .chain((nodes: VNode[]) => sideEffect(() => {
      if (nodes.length === 0)
        return nodes;

      nodes.forEach((item: VNode, index: number) => {
        circlePosition$
          .ap(functor(360 / nodes.length * index))
          .map(centerPositionOfShape)
          .map(toTranslate)
          .chain((str: string) => sideEffect(() => item.data.style.transform = str))
          .fold(id);
      });

      return nodes;
    }))
    .fold(id);

  next(userState);
};