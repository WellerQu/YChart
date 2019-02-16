import { InstanceAPI, PatchBehavior, TopoData, Line, Position, LineOption, } from '../cores/core';
import functor from '../cores/functor';
import { VNode, } from 'snabbdom/vnode';
import id from '../cores/id';
import { parseTranslate, toArrowPoints, isNotNull, distance, } from '../utils';
import { line, arrow, text, } from '../components/components';
import { NODE_SIZE, NODE_TYPE, ID_COMBINER, MIN_NODE_DISTANCE, } from '../constants/constants';

// 求有效线段, 即线段两段的点都能找到对应节点
const validLinesFilter = (map: Map<string, Position>) => (lines: Line[]) =>
  lines
    .filter((item: Line) => item.source !== item.target)
    .filter((item: Line) => map.has(item.source) && map.has(item.target))
    .map(
      (item: Line): LineOption => ({
        id: `${item.source}${ID_COMBINER}${item.target}`,
        source: map.get(item.source),
        target: map.get(item.target),
      })
    );

const mapToLineElement = ($stage: VNode) => (lineOptions: LineOption[]) => 
  $stage.children = lineOptions
    .map((item: LineOption) => line(item))
    .concat($stage.children as VNode[]);

const mapToArrowElement = ($stage: VNode) => (lineOptions: LineOption[]) => 
  $stage.children = lineOptions
    .map((item: LineOption) => {
      const [p1, p2, p3,] = toArrowPoints(item);

      return arrow({
        id: item.id,
        source: { x: p1.x, y: p1.y, },
        middle: { x: p2.x, y: p2.y, },
        target: { x: p3.x, y: p3.y, },
        opacity: distance(item.source)(item.target) < MIN_NODE_DISTANCE ? 0 : 1,
      });
    })
    .concat($stage.children as VNode[]);

const mapToDescElement = ($stage: VNode) => (lineOptions: LineOption[]) =>
  $stage.children = lineOptions
    .filter((item: LineOption) => isNotNull(item.text))
    .map((item: LineOption) => {
      return text({
        x: (item.target.x - item.source.x) / 2 + item.source.x,
        y: (item.target.y - item.source.y) / 2 + item.source.y,
        content: item.text,
        className: { 'line-desc': true, },
      });
    })
    .concat($stage.children as VNode[]);

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
  console.log('loaded link node middleware'); // eslint-disable-line

  const stage$ = functor(instance)
    .map((ins: InstanceAPI) => ins.getStage());
  const links$ = functor(userState)
    .map((state: TopoData) => state.links);

  const lineOptions$ = stage$
    .map(($stage: VNode) => $stage.children)
    .map((children: VNode[]) => children.filter(n => n.data.class))
    .map((children: VNode[]) => children.filter(n => n.data.class[NODE_TYPE.NODE]))
    .map((nodes: VNode[]) => {
      const map = new Map<string, Position>();

      nodes.forEach((item: VNode) => {
        map.set(item.data.attrs.id as string, centerPositionOfShape(item));
      });

      return map;
    })
    .map((map: Map<string, Position>) => (f: Function) => f(map))
    .ap(functor(validLinesFilter))
    .ap(links$);

  // 画箭头
  functor.of(mapToArrowElement).ap(stage$).ap(lineOptions$).fold(id);
  // 画线段
  functor.of(mapToLineElement).ap(stage$).ap(lineOptions$).fold(id);
  // 画文案
  functor.of(mapToDescElement).ap(stage$).ap(lineOptions$).fold(id);

  return next(userState);
};