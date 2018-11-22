/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';
import { Stage, PatchBehavior, TopoData, Position, Line, } from '../../typings/defines';
import { group, parseTranslate, clamp, toTranslate, } from '../utils';

export const nodeForceDirectedLayout = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  if (!userState)
    return next(userState);

  const root = stage.stageNode();
  const [ lines, nodes, rests, ] = group(root.children as VNode[]);

  // 若节点数大于500 或者小于4, 则被认为不适合本布局
  if (nodes.length >= 100 || nodes.length < 4) 
    return next(userState);

  const forceNodes = nodes.map<ForceNode>((node: VNode) => ({
    origin: node,
    lengthOfChild: userState.links.filter((line: Line) => line.source === node.data.key).length,
    // lengthOfChild: userState.links.length - 1,
  }));
  const newNodes = repeatRun(forceNodes).map(n => n.origin);

  root.children = [...rests, ...lines, ...newNodes,];

  next(userState);
};

// --------------------------- Force Directed Layout Implementation --------------------------- 

interface ForceNode {
  origin: VNode;
  lengthOfChild: number;
}

// 平衡后的距离
const BALANCE_DIST = 600;
// 最大位移变化
const MAX_DIST = 20;
// 最小位移变化
const MIN_DIST = 0;
// 运行次数
const COUNT = 50;
// 力衰减
const ATTENUATION = 80;
// 每次受力影响可移动的距离
const forceClamp = clamp(MIN_DIST, MAX_DIST);
// 重复100次
const repeatRun = repeat<ForceNode[]>(run, COUNT);

function run (nodes: ForceNode[]): ForceNode[] {
  for (let i = 0; i < nodes.length; i++) {
    const p1 = parseTranslate(nodes[i].origin.data.style['transform'] as string);

    for (let j = 0; j < nodes.length; j++) {
      if (nodes[i] === nodes[j]) 
        continue;

      const p2 = parseTranslate(nodes[j].origin.data.style['transform'] as string);
      const p3 = { x: p2.x, y: p2.y, };
      const dist = distance(p1, p2);

      // 力衰减变量
      let force = 0;

      // 两点过远
      if (dist > BALANCE_DIST) {
        force = (dist - BALANCE_DIST) / ATTENUATION; // 产生一个引力
        force = forceClamp(force);
        force += nodes[j].lengthOfChild / ATTENUATION;

        const k = force / dist;
        p3.x = k * (p1.x - p2.x) + p2.x;
        p3.y = k * (p1.y - p2.y) + p2.y;
      } 
      // 两点过近
      else if (dist < BALANCE_DIST) {
        force = (BALANCE_DIST - dist) / ATTENUATION; // 产生一个斥力
        force = forceClamp(force);
        force += nodes[j].lengthOfChild / ATTENUATION;

        const k = force / (dist + force);
        p3.x = (k * p1.x - p2.x) / (k - 1);
        p3.y = (k * p1.y - p2.y) / (k - 1);
      }
      // 距离正好
      else {
        // 啥也不用做
        console.log('距离正好'); // eslint-disable-line
      }

      nodes[j].origin.data.style['transform'] = toTranslate(p3);
    }
  }

  return nodes;
}

function repeat <T> (worker: (nodes: T) => T, preCount: number) {
  let counter = 0;
  let final: T = null;

  return (args: T): T => {
    final = args;

    while(counter++ < preCount) {
      final = worker(final);
    }

    return final;
  };
}

function power (x: number, size = 2):number {
  if (size === 0)
    return 1;
  if (size === 1)
    return x;
 
  return Array(size - 1).fill(x).reduce((product, item) => product * item, x);
}

function power2 (x:number): number {
  return power(x, 2);
}

function distance (p1: Position, p2: Position) {
  return Math.sqrt(power2(p1.x - p2.x) + power2(p1.y - p2.y));
}