import { VNode } from '../../node_modules/snabbdom/vnode';
import { Stage, PatchFn, TopoData, } from '../../typings/defines';
import { NODE_SIZE, CELL_SIZE } from '../constants';
import { NODE_TYPE } from '../NODE_TYPE';
import compose from '../compose';
import { toTranslate } from '../utils';

interface KeyInfo {
  vnode: VNode;
  x: number;
  y: number;
  id: number | string | boolean;
}

const max = (...nums: number[]): number => {
  const [ head, ...tail ] = nums;
  const _max = (x: number) => (y: number) => x > y ? x : y;
  const getResult = compose<number>(...tail.map((n: number) => _max(n)));
  return getResult(head);
};

const placeNode = (columnIndex: number) => (nodes: VNode[]): KeyInfo[] => {
  const space = (CELL_SIZE - NODE_SIZE) / 2;

  return nodes.map<KeyInfo>((item: VNode, rowIndex: number) => {
    return {
      vnode:
      {
        ...item,
        data: {
          ...item.data,
          style: {
            transform: toTranslate(CELL_SIZE * columnIndex + space, CELL_SIZE * rowIndex + space),
          }
        }
      },
      x: CELL_SIZE * columnIndex + space,
      y: CELL_SIZE * rowIndex + space,
      id: item.data.attrs.id,
    }
  });
};

const linkLine = (nodePool: KeyInfo[]) => (lines: VNode[]): VNode[] => {
  return lines.map((item: VNode) => {
    const id = item.data.attrs['id'] as string;
    if (!id.split) return item;

    const [source, target] = id.split('-');

    const s = nodePool.find(n => n.id === source);
    const t = nodePool.find(n => n.id === target);

    if (!s || !t)
      return item;

    const path: VNode = item.children[0] as VNode;
    if (!path)
      return item;
    const circle: VNode = item.children[1] as VNode;
    if (!circle)
      return item;

    const x1 = s.x + NODE_SIZE / 2 + 20;
    const y1 = s.y + NODE_SIZE / 2;
    const x2 = t.x + NODE_SIZE / 2;
    const y2 = t.y + NODE_SIZE / 2;

    circle.data.attrs.cx = x1;
    circle.data.attrs.cy = y1;
    path.data.attrs.d = `M${x1}, ${y1} Q${(x2 - x1) / 2 + x1}, ${(y2 - y1) / 2} ${x2}, ${y2}`;

    return {
      ...item,
    };
  });
};


const placeUserGroup = placeNode(0);
const placeServerGroup = placeNode(1);
const placeOtherGroup = placeNode(2);

// Example for middleware that show how to layout all elements
export const layout = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  // 按类型分组: 分成USER组, Server组, 其他(DATABASE/RPC/HTTP)组, Line组
  const root = stage.getStageNode();
  const nodes: (string | VNode)[] = stage.getStageNode().children;
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

  // 摆放节点
  const placedUserGroup = placeUserGroup(userGroup);
  const placedServiceGroup = placeServerGroup(serverGroup);
  const placedOtherGroup = placeOtherGroup(otherGroup);

  // 摆放线段
  const allElements = [...placedUserGroup, ...placedServiceGroup, ...placedOtherGroup];
  const placeLineGroup = linkLine(allElements);
  const placedLineGroup = placeLineGroup(lineGroup);

  // 无论图多复杂多大, 初始化时一定会在一屏内显示完整
  // const ref = stage.getContainer();
  // const containerWidth = ref.parentElement.offsetWidth;
  // const containerHeight = ref.parentElement.offsetHeight;
  // const maxHeight = max(userGroup.length, serverGroup.length, otherGroup.length) * CELL_SIZE;
  // const maxWidth = CELL_SIZE * 3;
  // const viewBoxWidth = maxHeight > maxWidth ? maxWidth * maxHeight / containerHeight : maxWidth;
  // const viewBoxHeight = maxWidth > maxHeight ? maxHeight * maxWidth / containerWidth : maxHeight;

  // if (maxHeight > maxWidth) {
  //   root.data.attrs.viewBox = `${(viewBoxWidth - containerWidth) / -2}, 0, ${viewBoxWidth}, ${viewBoxHeight}`;
  // } else {
  //   root.data.attrs.viewBox = `0, ${(viewBoxHeight - containerHeight) / -2}, ${viewBoxWidth}, ${viewBoxHeight}`;
  // }

  root.children = [...restGroup, ...placedLineGroup, ...placedUserGroup.map(n => n.vnode), ...placedServiceGroup.map(n => n.vnode), ...placedOtherGroup.map(n => n.vnode)];

  next(userState);
};