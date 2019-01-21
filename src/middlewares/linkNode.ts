import { InstanceAPI, PatchBehavior, TopoData, Line, Position, LineOption, } from '../cores/core';
import functor from '../cores/functor';
import { VNode, } from 'snabbdom/vnode';
import id from '../cores/id';
import { parseTranslate, } from '../utils';
import { line, arrow, } from '../components/components';
import { NODE_SIZE, ARROW_OFFSET, ARROW_HEIGHT, } from '../constants/constants';

// 求两点间的直线距离
const distance = (a: Position) => (b: Position) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
// 两点间最小距离
const MIN_DISTANCE_BETWEEN_TWO_POINTS = 140;

// 求有效线段, 即线段两段的点都能找到对应节点
const validLinesFilter = (map: Map<string, Position>) => (lines: Line[]) =>
  lines
    .filter((item: Line) => item.source !== item.target)
    .filter((item: Line) => map.has(item.source) && map.has(item.target))
    .map((item: Line): LineOption => ({
      id: `${item.source}-to-${item.target}`,
      source: map.get(item.source),
      target: map.get(item.target),
    }));

const mapToLineElement = ($stage: VNode) => (lineOptions: LineOption[]) => {
  return $stage.children = lineOptions
    .map((item: LineOption) => line(item))
    .concat($stage.children as VNode[]);
};

const mapToArrowElement = ($stage: VNode) => (lineOptions: LineOption[]) => {
  return $stage.children = lineOptions
    .filter((item: LineOption) => distance(item.source)(item.target) > MIN_DISTANCE_BETWEEN_TWO_POINTS)
    .map((item: LineOption) => {
      // 求箭头三角形的顶点
      const topX = (item.target.x - item.source.x) * ARROW_OFFSET / distance(item.source)(item.target) + item.source.x;
      const topY = (item.target.y - item.source.y) * ARROW_OFFSET / distance(item.source)(item.target) + item.source.y;

      // 求箭头三角形的底边中点
      const centerOfBottomX = (topX - item.source.x) * ARROW_OFFSET / (ARROW_OFFSET - ARROW_HEIGHT) + item.source.x;
      const centerOfBottomY = (topY - item.source.y) * ARROW_OFFSET / (ARROW_OFFSET - ARROW_HEIGHT) + item.source.y;

      return arrow({
        id: item.id,
        source: { x: topX, y: topY,},
        middle: { x: centerOfBottomX, y: centerOfBottomY, },
        target: { x: centerOfBottomX, y: centerOfBottomY, },
      }, 'red');
    })
    .concat($stage.children as VNode[]);
};

// 求几何图形的中心点
const centerPositionOfShape = (node: VNode) => 
  functor(node)
    .map((node: VNode) => node.data.style.transform)
    .map(parseTranslate)
    .map((pos: Position) => ({
      x: pos.x + NODE_SIZE / 2,
      y: pos.y + NODE_SIZE / 2,
    }))
    .fold(id);

export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState: TopoData) => {
  const stage$ = functor(instance)
    .map((ins: InstanceAPI) => ins.getStage());

  const lineOptions$ = stage$
    .map(($stage: VNode) => $stage.children)
    .map((children: VNode[]) => children.filter(n => n.data.class))
    .map((children: VNode[]) => children.filter(n => n.data.class['group']))
    .map((nodes: VNode[]) => {
      const map = new Map<string, Position>();

      nodes.forEach((item: VNode) => {
        map.set(item.data.attrs.id as string, centerPositionOfShape(item));
      });

      return map;
    })
    .map((map: Map<string, Position>) => (f: Function) => f(map))
    .ap(functor(validLinesFilter))
    .ap(functor(userState.links));

  functor.of(mapToArrowElement).ap(stage$).ap(lineOptions$).fold(id);
  functor.of(mapToLineElement).ap(stage$).ap(lineOptions$).fold(id);

  return next(userState);
};