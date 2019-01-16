/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';

import { TopoData, PatchBehavior, InstanceAPI, Position, Size, } from '../cores/core';
import {  NODE_SIZE, } from '../constants/constants';
import id from '../cores/id';
import { toTranslate, } from '../utils';
import functor from '../cores/functor';
import sideEffect from '../cores/sideEffect';

// 求容器的中心点
const centerPositionOfSize = (size: Size) =>
  ({ x: size.width / 2, y: size.height / 2,});

// 求节点的中心点
const centerPositionOfShape = (pos: Position) =>
  ({ x: pos.x - NODE_SIZE / 2, y: pos.y - NODE_SIZE / 2,});

/**
 * 拓扑图布局策略
 * 简单的按节点类型分组进行布局的策略
 * 
 * instance::InstanceAPI -> next::PatchBehavior -> state::TopoData -> void
 */
export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState: TopoData) => {
  functor(instance)
    .map((ins: InstanceAPI) => ins.getStage())
    .map(($stage: VNode) => $stage.children)
    .map((children: VNode[]) => children.filter(n => n.data.class))
    .map((children: VNode[]) => children.filter(n => n.data.class['group']))
    .chain((nodes: VNode[]) => sideEffect(() => {
      if (nodes.length === 0)
        return nodes;

      const LEN = 6, RADIUS = 200;
      const [first, ...tails] = nodes;

      /*
      * Applicative:
      * Identity: A.of(x => x).ap(v) === v
      * Homomorphism: A.of(f).ap(A.of(x)) === A.of(f(x))
      * Interchange: u.ap(A.of(y)) === A.of(f => f(y)).ap(u)
      * 
      * Applicative函子公式, 这里应用了交换律(Interchange)
      */
      const center$ = functor(instance)
        .map((ins: InstanceAPI) => (f: Function) => f(ins.size()))
        .ap(functor(centerPositionOfSize));
      const itemPosition$ = functor((deg: number) => (radius: number) => (center: Position) => ({
        // deg * Math.PI / 180 : 角度转弧度
        x: Math.sin(deg * Math.PI / 180) * radius + center.x,
        y: Math.cos(deg * Math.PI / 180) * radius + center.y,
      }));

      center$
        .map(centerPositionOfShape)
        .map(toTranslate)
        .chain((str: string) => sideEffect(() => first.data.style.transform = str))
        .fold(id);

      tails.reduce((deg: number, item: VNode, index: number) => {
        itemPosition$
          .ap(functor(deg))
          .ap(functor(((index / LEN >> 0) + 1) * RADIUS))
          .ap(center$)
          .map(centerPositionOfShape)
          .map(toTranslate)
          .chain((str: string) => sideEffect(() => item.data.style.transform = str))
          .fold(id);

        return deg + 360 / LEN;
      }, 0);

      return nodes;
    }))
    .fold(id);

  // call next middleware
  return next(userState);
};