import { PatchBehavior, Stage, TopoData, Middleware, Position, Line, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import { NODE_TYPE, } from '../NODE_TYPE';
import { toTranslate, toArrowD, clamp, } from '../utils';
import { NODE_SIZE, ARROW_OFFSET, } from '../constants';
// import { CELL_SIZE, } from '../constants';

const radianClamp = clamp(Math.PI / 4, Math.PI * 2);

interface SortInfo {
  node: VNode;
  linkCount: number;
}

// 拓扑图环形布局策略, 适用于4个以上的节点的布局策略
export const nodeCircleLayout: Middleware = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  if (!userState)
    return next(userState);

  if (userState.nodes.length <= 4)
    return next(userState);

  const root = stage.stageNode();
  const nodes = root.children as VNode[];
  const userGroup: VNode[] = [];
  const serverGroup: VNode[] = [];
  const otherGroup: VNode[] = [];
  const lineGroup: VNode[] = [];
  const restGroup: ( VNode | string )[] = [];

  for (let i = 0, len = nodes.length; i < len; i++) {
    const node: VNode = nodes[i] as VNode;

    if (!node.data || !node.data.class) {
      // 暂时不打算处理的节点
      restGroup.push(node);
      continue;
    }

    const classNames = node.data.class;

    if (classNames[NODE_TYPE.LINE]) {
      lineGroup.push(node);
      continue;
    }

    if (classNames[NODE_TYPE.USER]) {
      userGroup.push(node);
      continue;
    }

    if (classNames[NODE_TYPE.SERVER]) {
      serverGroup.push(node);
      continue;
    }

    otherGroup.push(node);
  }

  if (serverGroup.length > 12)
    return next(userState);

  // const size = stage.size();
  const size = {
    width: 900,
    height: 450,
  };
  const positionMap = new Map<string, Position>();

  // 圆环中心
  const o: Position = { x: size.width / 2, y: size.height / 2,};
  // 圆环半径
  const radius = 500;

  // 偏移圆心从而偏移圆环上的各个点
  // o.x += 200;
  o.x -= NODE_SIZE / 2;
  o.y -= NODE_SIZE / 2;

  // 单位弧度, service节点均匀的分布在圆环上
  let radian = 2 * Math.PI / serverGroup.length;
  const sortedService = serverGroup.map<SortInfo>((node: VNode): SortInfo => {
    return {
      node,
      linkCount: userState.links.filter((line: Line) => line.source === node.key || line.target === node.key).length,
    };
  });
  sortedService.sort((a, b) => a.linkCount - b.linkCount);
  sortedService.map((item: SortInfo) => item.node).forEach((item: VNode, index: number): void => {
    const currentRadian: number = index * radian - Math.PI / 2;
    const c: Position = { x: 0, y: 0, }; // 初始化而已
    const offset = 600;

    c.x = Math.cos(currentRadian) * radius + o.x + offset;
    c.y = Math.sin(currentRadian) * radius + o.y;

    item.data = {
      ...item.data,
      style: {
        transform: toTranslate(c.x, c.y),
      },
    };

    positionMap.set(item.key as string, c);
  });
  

  radian = 2 * Math.PI / userGroup.length;
  userGroup.forEach((item: VNode) => {
    const c: Position = { x: o.x, y: o.y, };

    c.x = 100;
    item.data = {
      ...item.data,
      style: {
        transform: toTranslate(c.x, c.y),
      },
    };

    positionMap.set(item.key as string, c); 
  });

  radian = 2 * Math.PI / otherGroup.length / 2;
  const sortedOhters = otherGroup.map<SortInfo>((node: VNode): SortInfo => {
    return {
      node,
      linkCount: userState.links.filter((line: Line) => line.source === node.key || line.target === node.key).length,
    };
  });
  sortedOhters.sort((a, b) => a.linkCount - b.linkCount);
  sortedOhters.map((item: SortInfo) => item.node).forEach((item: VNode, index: number) => {
    const currentRadian: number = index * radian - Math.PI / 2;
    const c: Position = { x: 0, y: 0, }; // 初始化而已
    const offset = 900;

    c.x = Math.cos(currentRadian) * (radius) + o.x + offset;
    c.y = Math.sin(currentRadian) * (radius) + o.y;

    item.data = {
      ...item.data,
      style: {
        transform: toTranslate(c.x, c.y),
      },
    };

    positionMap.set(item.key as string, c); 
  });

  lineGroup.forEach((item: VNode) => {
    const id = item.data.attrs['id'] as string;
    if (!id.split) return;

    const [source, ...target] = id.split('-');
    if (!positionMap.has(source)) return;
    if (!positionMap.has(target.join('-'))) return;

    const start = positionMap.get(source);
    const end = positionMap.get(target.join('-'));

    const line: VNode = item.children[0] as VNode;
    const arrow: VNode = item.children[1] as VNode;
    const text: VNode = item.children[2] as VNode;

    const x1 = start.x + NODE_SIZE / 2;
    const y1 = start.y + NODE_SIZE / 2;
    const x2 = end.x + NODE_SIZE / 2;
    const y2 = end.y + NODE_SIZE / 2;

    // update arrow
    if (arrow) {
      const lA = y2 - y1;
      const lB = x2 - x1;
      const lC = Math.sqrt(Math.pow(lA, 2) + Math.pow(lB, 2));

      const lc = ARROW_OFFSET;
      const la = (lc * lA) / lC;
      const lb = (lc * lB) / lC;

      const arrowX = lb + x1;
      const arrowY = la + y1;

      arrow.data.attrs.d = toArrowD(arrowX, arrowY);

      // atan2使用的坐标系0度在3点钟方向, rotate使用的坐标系0度在12点钟方向, 相差90度
      const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI + 90; // 阿尔法a
      arrow.data.attrs.transform = `rotate(${a}, ${arrowX} ${arrowY})`;
    }

    // update text position
    if (text) {
      text.data.attrs.x = (x2 - x1) / 2 + x1;
      text.data.attrs.y = (y2 - y1) / 2 + y1;
    }

    // link line
    if (line) {
      line.data.attrs.d = `M${x1},${y1} L${x2},${y2}`;
    }
  });

  next(userState);
};