/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';

import { Stage, PatchBehavior, TopoData, Position, } from '../../typings/defines';
import { NODE_SIZE, CELL_SIZE, NODE_TYPE, } from '../constants/constants';
import { toTranslate, group, } from '../utils';

/**
 * 布局用的关键信息
 */
interface KeyInfo {
  vnode: VNode;
  position: Position;
  id: number | string | boolean;
}

/**
 * 摆放节点
 * @param columnIndex 列索引
 */
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

/**
 * 将用户节点摆在列索引为0的那一列
 */
const placeUserGroup = placeNode(0);
/**
 * 将服务节点摆在列索引巍1的那一列
 */
const placeServerGroup = placeNode(1);
/**
 * 将远程调用/HTTP/DATABASE等等节点摆在列索引为2的那一列
 */
const placeRemoteGroup = placeNode(2);

/**
 * 拓扑图布局策略
 * 简单的按节点类型分组进行布局的策略
 */
export const nodeGroupLayout = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  // 没有数据, 部需要布局
  if (!userState)
    return next(userState);
  if (userState.nodes.length === 0)
    return next(userState);

  // 按类型分组: 分成USER组, Server组, 其他(DATABASE/RPC/HTTP)组, Line组
  const root = stage.stageNode();
  const children = root.children as VNode[];

  const userGroup: VNode[] = [];
  const serverGroup: VNode[] = [];
  const remoteGroup: VNode[] = [];

  const [lineGroup, nodes, restGroup,] = group(children);

  // 分组
  for (let i = 0, len = nodes.length; i < len; i++) {
    const node: VNode = nodes[i] as VNode;
    const classNames = node.data.class;

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

  // 重构root的children, 这将影响界面上节点的顺序
  root.children = [
    ...restGroup, 
    ...lineGroup, 
    ...placedUserGroup.map(n => n.vnode), 
    ...placedServiceGroup.map(n => n.vnode), 
    ...placedRemoteGroup.map(n => n.vnode),
  ];

  // 调用下一个中间件
  next(userState);
};