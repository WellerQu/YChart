/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

import { VNode, } from 'snabbdom/vnode';

import { Stage, PatchFn, TopoData, } from '../../typings/defines';
import { NODE_SIZE, CELL_SIZE, ARROW_OFFSET, } from '../constants';
import { NODE_TYPE, } from '../NODE_TYPE';
import { toTranslate, toArrowD, } from '../utils';

// 布局用的关键信息
interface KeyInfo {
  vnode: VNode;
  x: number;
  y: number;
  id: number | string | boolean;
}

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
          },
        },
      },
      x: CELL_SIZE * columnIndex + space,
      y: CELL_SIZE * rowIndex + space,
      id: item.data.attrs.id,
    };
  });
};

const linkLine = (nodePool: KeyInfo[]) => (lines: VNode[]): VNode[] => {
  return lines.map((item: VNode) => {
    const id = item.data.attrs['id'] as string;
    if (!id.split) return item;

    const [source, ...target] = id.split('-');

    const s = nodePool.find(n => n.id === source);
    const t = nodePool.find(n => n.id === target.join('-'));

    if (!s || !t)
      return item;

    const line: VNode = item.children[0] as VNode;
    if (!line)
      return item;
    const arrow: VNode = item.children[1] as VNode;
    if (!arrow)
      return item;
    const text: VNode = item.children[2] as VNode;
    if (!text)
      return item;

    const x1 = s.x + NODE_SIZE / 2;
    const y1 = s.y + NODE_SIZE / 2;
    const x2 = t.x + NODE_SIZE / 2;
    const y2 = t.y + NODE_SIZE / 2;

    // update arrow
    const lA = y2 - y1;
    const lB = x2 - x1;
    const lC = Math.sqrt(Math.pow(lA, 2) + Math.pow(lB, 2));

    const lc = ARROW_OFFSET;
    const la = lc * lA / lC;
    const lb = lc * lB / lC;

    const arrowX = lb + x1;
    const arrowY = la + y1;

    arrow.data.attrs.d = toArrowD(arrowX, arrowY);

    // atan2使用的坐标系0度在3点钟方向, rotate使用的坐标系0度在12点钟方向, 相差90度
    const a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90; // 阿尔法a
    arrow.data.attrs.transform = `rotate(${a}, ${arrowX} ${arrowY})`;

    // update text position
    text.data.attrs.x = (x2 - x1) / 2 + x1;
    text.data.attrs.y = (y2 - y1) / 2 + y1;

    // link line
    line.data.attrs.d = `M${x1},${y1} L${x2},${y2}`;

    return {
      ...item,
    };
  });
};

const placeUserGroup = placeNode(0);
const placeServerGroup = placeNode(1);
const placeOtherGroup = placeNode(2);

// Example for middleware that show how to layout all elements
export const nodeLayout = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  // 按类型分组: 分成USER组, Server组, 其他(DATABASE/RPC/HTTP)组, Line组
  const root = stage.stageNode();
  const nodes: (string | VNode)[] = stage.stageNode().children;
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
  const allElements = [...placedUserGroup, ...placedServiceGroup, ...placedOtherGroup,];
  const placeLineGroup = linkLine(allElements);
  const placedLineGroup = placeLineGroup(lineGroup);

  root.children = [
    ...restGroup, 
    ...placedLineGroup, 
    ...placedUserGroup.map(n => n.vnode), 
    ...placedServiceGroup.map(n => n.vnode), 
    ...placedOtherGroup.map(n => n.vnode),
  ];

  next(userState);
};