import {
  PatchBehavior,
  Stage,
  TopoData,
  Middleware,
  Position,
  Line,
} from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import { NODE_TYPE, } from '../NODE_TYPE';
import { toTranslate, toArrowD, updateLinePoistion, } from '../utils';
import { NODE_SIZE, ARROW_OFFSET, } from '../constants';

interface SortInfo {
  node: VNode;
  linkCount: number;
}

// 拓扑图环形布局策略, 适用于4个以上12个以下的节点的布局策略
export const nodeCircleLayout: Middleware = (stage: Stage) => (
  next: PatchBehavior
) => (userState?: TopoData) => {
  if (!userState) return next(userState);
  if (userState.nodes.length === 0) return next(userState);
  if (userState.nodes.length <= 4) return next(userState);

  const root = stage.stageNode();
  const nodes = root.children as VNode[];

  const userGroup: VNode[] = [];
  const serverGroup: VNode[] = [];
  const remoteGroup: VNode[] = [];
  const lineGroup: VNode[] = [];
  const restGroup: (VNode | string)[] = [];

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

    remoteGroup.push(node);
  }

  const size = stage.size();
  const positionMap = new Map<string, Position>();

  // 圆环中心
  const o: Position = { x: size.width / 2, y: size.height / 2, };
  // 圆环半径
  const radius = size.height / 2;

  // 偏移圆心从而偏移圆环上的各个点
  // o.x += 200;
  o.x -= NODE_SIZE / 2;
  o.y -= NODE_SIZE / 2;

  // 单位弧度, 节点均匀的分布在圆环上
  let radian = (2 * Math.PI) / serverGroup.length;

  // 按连接数进行排序
  const sortedService = serverGroup.map<SortInfo>(
    (node: VNode): SortInfo => {
      return {
        node,
        linkCount: userState.links.filter(
          (line: Line) => line.source === node.key || line.target === node.key
        ).length,
      };
    }
  );
  sortedService.sort((a, b) => a.linkCount - b.linkCount);
  const newServiceNodes = sortedService
    .map((item: SortInfo) => item.node)
    .map((item: VNode, index: number) => {
      const currentRadian: number = index * radian - Math.PI / 2;
      const c: Position = { x: 0, y: 0, }; // 初始化而已

      c.x = Math.cos(currentRadian) * radius + o.x;
      c.y = Math.sin(currentRadian) * radius + o.y;

      item.data = {
        ...item.data,
        style: {
          transform: toTranslate(c.x, c.y),
        },
      };

      positionMap.set(item.key as string, c);

      return item;
    });

  radian = (2 * Math.PI) / userGroup.length;
  const newUserNodes = userGroup.map((item: VNode) => {
    const c: Position = { x: 0, y: 0, };

    c.x = o.x - (radius + NODE_SIZE);
    c.y = o.y;

    item.data = {
      ...item.data,
      style: {
        transform: toTranslate(c.x, c.y),
      },
    };

    positionMap.set(item.key as string, c);

    return item;
  });

  radian = (2 * Math.PI) / remoteGroup.length / 2;
  const sortedRemote = remoteGroup.map<SortInfo>(
    (node: VNode): SortInfo => {
      return {
        node,
        linkCount: userState.links.filter(
          (line: Line) => line.source === node.key || line.target === node.key
        ).length,
      };
    }
  );
  sortedRemote.sort((a, b) => a.linkCount - b.linkCount);
  const newRemoteNodes = sortedRemote
    .map((item: SortInfo) => item.node)
    .map((item: VNode, index: number) => {
      const currentRadian: number = index * radian - Math.PI / 2;
      const c: Position = { x: 0, y: 0, }; // 初始化而已
      const offset = radius + NODE_SIZE;

      c.x = Math.cos(currentRadian) * radius + o.x + offset;
      c.y = Math.sin(currentRadian) * radius + o.y;

      item.data = {
        ...item.data,
        style: {
          transform: toTranslate(c.x, c.y),
        },
      };

      positionMap.set(item.key as string, c);

      return item;
    });

  const newLines = lineGroup.map((item: VNode) => {
    const id = item.data.attrs['id'] as string;
    if (!id.split) return item;

    const [source, ...target] = id.split('-');
    if (!positionMap.has(source)) return item;
    if (!positionMap.has(target.join('-'))) return item;

    const start = positionMap.get(source);
    const end = positionMap.get(target.join('-'));

    // 更新线的起始与结束坐标
    return updateLinePoistion(item, start, end);
  });

  root.children = [
    ...restGroup,
    ...newLines,
    ...newUserNodes,
    ...newServiceNodes,
    ...newRemoteNodes,
  ];

  next(userState);
};
