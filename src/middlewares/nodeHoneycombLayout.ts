/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';

import { TopoData, PatchBehavior, InstanceAPI, Position, Size, InstanceState, } from '../cores/core';
import {  NODE_SIZE, TOPO_LAYOUT_STATE, } from '../constants/constants';
import id from '../cores/id';
import { toTranslate, } from '../utils';
import functor from '../cores/functor';
import sideEffect from '../cores/sideEffect';

const EDGE = 6, RADIUS = 200;

// 求容器的中心点
const centerPositionOfContainer = (size: Size) =>
  ({ x: size.width / 2, y: size.height / 2,});

// 求节点的中心点
const centerPositionOfShape = (pos: Position) =>
  ({ x: pos.x - NODE_SIZE / 2, y: pos.y - NODE_SIZE / 2,});

/**
 * 拓扑图布局策略 - 蜂巢布局
 */
export default (instance: InstanceState) => (next: PatchBehavior) => (userState: TopoData) => {
  if (instance.layout() !== TOPO_LAYOUT_STATE.HONEY_COMB) 
    return next(userState);

  console.log('apply honey comb layout strategy'); // eslint-disable-line

  const size$ = functor(instance).map((ins: InstanceAPI) => ins.size());
  const center$ = size$.map(centerPositionOfContainer);
  const itemPosition$ = functor((center: Position) => (radius: number) => (deg: number) => ({
    x: Math.sin(deg * Math.PI / 180) * radius + center.x,
    y: Math.cos(deg * Math.PI / 180) * radius + center.y,
  }))
    .ap(center$);

  const placeCenterNode = (nodes: VNode[]) => () => {
    if (nodes.length === 0) return nodes;

    const [first, ...tails] = nodes;

    center$
      .map(centerPositionOfShape)
      .map(toTranslate)
      .chain((str: string) =>
        sideEffect(() => (first.data.style.transform = str))
      )
      .fold(id);

    return tails;
  };

  const placeOtherNode = (nodes: VNode[]) => () => 
    nodes.map((item: VNode, index: number) => 
      itemPosition$
        .ap(functor((((index / EDGE) >> 0) + 1) * RADIUS))
        .ap(functor((360 / EDGE) * index))
        .map(centerPositionOfShape)
        .map(toTranslate)
        .chain((str: string) =>
          sideEffect(() => (item.data.style.transform = str))
        )
        .fold(id)
    );

  functor(instance)
    .map((ins: InstanceAPI) => ins.getStage())
    .map(($stage: VNode) => $stage.children || [])
    .map((children: VNode[]) => children.filter(n => n.data.class))
    .map((children: VNode[]) => children.filter(n => n.data.class['group']))
    .chain((nodes: VNode[]) => sideEffect(placeCenterNode(nodes)))
    .chain((f: Function) => functor(f()))
    .chain((nodes: VNode[]) => sideEffect(placeOtherNode(nodes)))
    .fold(id);

  // call next middleware
  return next(userState);
};