/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';

import { Stage, PatchBehavior, TopoData, Position, } from '../../typings/defines';
import { NODE_SIZE, CELL_SIZE, NODE_TYPE, } from '../constants/constants';
import { toTranslate, } from '../utils';

// 布局用的关键信息
interface KeyInfo {
  vnode: VNode;
  position: Position;
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
      position: {
        x: CELL_SIZE * columnIndex + space,
        y: CELL_SIZE * rowIndex + space,
      },
      id: item.data.attrs.id,
    };
  });
};

const placeUserGroup = placeNode(0);
const placeServerGroup = placeNode(1);
const placeRemoteGroup = placeNode(2);

// 拓扑图布局策略, 适用于4个(含)以下节点的简单布局策略
export const nodeGroupLayout = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  // 没有数据, 部需要布局
  if (!userState)
    return next(userState);
  if (userState.nodes.length === 0)
    return next(userState);

  // 按类型分组: 分成USER组, Server组, 其他(DATABASE/RPC/HTTP)组, Line组
  const root = stage.stageNode();
  const nodes: (string | VNode)[] = root.children;

  const userGroup: VNode[] = [];
  const serverGroup: VNode[] = [];
  const remoteGroup: VNode[] = [];
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

    remoteGroup.push(node);
  }

  // 摆放节点
  const placedUserGroup = placeUserGroup(userGroup);
  const placedServiceGroup = placeServerGroup(serverGroup);
  const placedRemoteGroup = placeRemoteGroup(remoteGroup);

  root.children = [
    ...restGroup, 
    ...lineGroup, 
    ...placedUserGroup.map(n => n.vnode), 
    ...placedServiceGroup.map(n => n.vnode), 
    ...placedRemoteGroup.map(n => n.vnode),
  ];

  next(userState);
};