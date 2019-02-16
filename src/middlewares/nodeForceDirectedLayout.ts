import { InstanceAPI, PatchBehavior, TopoData, InstanceState, Position, Size, Line, } from '../cores/core';
import functor from '../cores/functor';
import { VNode, } from 'snabbdom/vnode';
import sideEffect from '../cores/sideEffect';
import id from '../cores/id';
import { TOPO_LAYOUT_STATE, NODE_TYPE, NODE_SIZE, } from '../constants/constants';
import { parseTranslate, distance, toTranslate, clamp, } from '../utils';

/**
 * @module middlewares
 */

// 平移属性名
const TRANSFORM = 'transform';
// 最小距离
const MIN_DIST = 2 * NODE_SIZE;
// 运行次数
const RUN_COUNT = 200;
// 力衰减
const ATTENUATION = 80;

// 应用弹性布局
const applyForce = (nodes: VNode[]) => (isRelated: (node: VNode, another: VNode) => boolean) => {
  for (let i = 0; i < nodes.length; i++) {
    const p1 = parseTranslate(nodes[i].data.style[TRANSFORM]);

    for (let j = 0; j < nodes.length; j++) {
      if (nodes[i] === nodes[j])
        continue;

      const p2 = parseTranslate(nodes[j].data.style[TRANSFORM]);
      const p3 = { x: p2.x, y: p2.y, };
      const dist = distance(p1)(p2);

      // 力向量
      const force: Position = { x: 0, y: 0, };
     

      // 小于最小距离且两点之间有关系, 则产生一个引力
      if (dist > MIN_DIST && isRelated(nodes[i], nodes[j])) {
        force.x = (Math.abs(p1.x - p2.x) - MIN_DIST) / ATTENUATION;
        force.y = (Math.abs(p1.y - p2.y) - MIN_DIST) / ATTENUATION;
        // 两个方向的合力
        const mergedForce = Math.sqrt(Math.pow(force.x, 2) + Math.pow(force.y, 2));
        const k = mergedForce / dist;

        p3.x = k * (p1.x - p2.x) + p2.x;
        p3.y = k * (p1.y - p2.y) + p2.y;
      }
      // 大于最小距离且两点之间无关系, 则产生一个斥力
      else if (dist < MIN_DIST) {
        force.x = (MIN_DIST - Math.abs(p1.x - p2.x)) / ATTENUATION;
        force.y = (MIN_DIST - Math.abs(p1.y - p2.y)) / ATTENUATION;
        // 两个方向的合力
        const mergedForce = Math.sqrt(Math.pow(force.x, 2) + Math.pow(force.y, 2));
        const k = mergedForce / (dist + mergedForce);
        p3.x = (k * p1.x - p2.x) / (k - 1);
        p3.y = (k * p1.y - p2.y) / (k - 1);
      }
      // 其他不用动

      nodes[j].data.style[TRANSFORM] = toTranslate(p3);
    }
  }

  return nodes;
};

// 求容器的中心点
const centerPositionOfContainer = (size: Size) => ({
  x: size.width / 2,
  y: size.height / 2,
});

// 求节点的中心点
const centerPositionOfShape = (pos: Position) =>
  ({ x: pos.x - NODE_SIZE / 2, y: pos.y - NODE_SIZE / 2,});

// 节点间关系鉴定
const relation = (links: Line[]) => (node: VNode, another: VNode) => {
  return links.find((line: Line) =>
    (line.source === node.key && line.target === another.key)
    ||
    (line.source === another.key && line.target === node.key)
  ) !== void 0;
};

/**
 * 拓扑图布局策略 - 力导向布局
 */
export default (instance: InstanceState) => (next: PatchBehavior) => (userState: TopoData) => {
  if (instance.layout() !== TOPO_LAYOUT_STATE.FORCE_DIRECTED)
    return next(userState);

  console.log('applied force directed layout strategy'); // eslint-disable-line

  const nodes$ = functor(instance.getStage())
    .map(($stage: VNode) => $stage.children)
    .map((children: VNode[]) => children.filter(n => n.data.class))
    .map((children: VNode[]) => children.filter(n => n.data.class[NODE_TYPE.NODE]));
  const center$ = functor(instance.size())
    .map(centerPositionOfContainer)
    .map(centerPositionOfShape);

  const place$ = functor(
    (center: Position) =>
      (radius: number) =>
        (deg: number) =>
          toTranslate({
            x: Math.sin(deg * Math.PI / 180) * radius + center.x,
            y: Math.cos(deg * Math.PI / 180) * radius + center.y,
          })
  )
    .ap(center$)
    .ap(functor(MIN_DIST));

  nodes$
    .chain((nodes: VNode[]) => sideEffect(() => {
      if (nodes.length === 0)
        return nodes;

      // 在运行弹性布局之前, 必须要有一个初始化的布局, 否则无法计算力的方向
      // 为了杜绝节点坐标重叠和相对集中, 采用圆环布局, 理论上最大可以容纳360个节点
      nodes.forEach((item: VNode, index: number) => {
        item.data.style[TRANSFORM] = place$
          .ap(functor((360 / nodes.length) * index))
          .fold(id);
      });

      for (let i = 0; i < RUN_COUNT; i++) {
        applyForce(nodes)(relation(userState.links));
      }

      return nodes;
    }))
    .fold(id);

  return next(userState);
};