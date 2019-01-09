/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import { setupEventHandler, findGroup, findRoot, } from '../utils';
import { ID_COMBINER, NODE_TYPE, TOPO_OPERATION_STATE, } from '../constants/constants';
import compose from '../compose';

type Child =  string | VNode;

/**
 * 显示与鼠标当前悬停节点存在直接调用/被调用关系的其它节点
 */
export const showRelation = (getState: () => number) => (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  if (!userState)
    return next(userState);
  if (userState.nodes.length === 0)
    return next(userState);

  const map = new Map<string, HTMLElement>();
  
  // 是否正在进行拖拽操作
  let isDragging = false;

  const handleMouseDown = (event: MouseEvent): MouseEvent => {
    isDragging = true;
    return handleMouseLeave(event);
  };

  const handleMouseUp = (event: MouseEvent): MouseEvent => {
    isDragging = false;
    return handleMouseEnter(event);
  };

  // 鼠标悬停事件处理程序
  const handleMouseEnter = (event: MouseEvent): MouseEvent => {
    if (isDragging) return event;
    if (getState() !== TOPO_OPERATION_STATE.CAN_SHOW_RELATIONSHIP) return event;

    const sender = findGroup(event);
    if (!sender) return event;

    const root = findRoot(event);
    if (!root) return event;

    const ID = sender.id;
    const lines = Array.from(root.querySelectorAll(`.${NODE_TYPE.LINE}`));
    const nodes = Array.from(root.querySelectorAll(`.${NODE_TYPE.NODE}`));

    const relatedLines = lines.filter((item: HTMLElement) => {
      const [source, target,] = item.id.split(ID_COMBINER);
      return source === ID || target === ID;
    });
    const relatedNodes = nodes.filter((item: HTMLElement) => {
      const nodeID = item.id;
      return ID !== nodeID && relatedLines.some((innerItem: HTMLElement) => {
        const [source, target,] = innerItem.id.split(ID_COMBINER);
        return source === nodeID || target === nodeID;
      });
    });

    [...relatedLines, ...relatedNodes, sender,].forEach(n => map.set(n.id, n as HTMLElement));

    [...lines, ...nodes,].forEach(item => {
      if (!map.has(item.id)) {
        item.classList.add('weak');
      }
    });

    return event;
  };

  // 鼠标离开事件处理程序
  const handleMouseLeave = (event: MouseEvent): MouseEvent => {
    const root = findRoot(event);
    if (!root) return event;

    const lines = Array.from(root.querySelectorAll(`.${NODE_TYPE.LINE}`));
    const nodes = Array.from(root.querySelectorAll(`.${NODE_TYPE.NODE}`));

    [...lines, ...nodes,].forEach(item => {
      item.classList.remove('weak');
    });
    map.clear();

    return event;
  };

  const setupRelationHandler = compose<VNode>(
    setupEventHandler(handleMouseEnter)('mouseenter'), 
    setupEventHandler(handleMouseLeave)('mouseleave'),
  ); 

  const setupDragMoveHandler = compose<VNode>(
    setupEventHandler(handleMouseDown)('mousedown'),
    setupEventHandler(handleMouseUp)('mouseup'),
    // setupEventHandler(handleMouseUp)('mouseout'),
  );

  const root = stage.stageNode();
  const children = root.children;

  // 绑定开关处理事件事件
  setupDragMoveHandler(root);

  // 遍历每一个节点
  root.children = children.map((item: Child) => {
    const node = item as VNode;
    if (!node.data)
      return node;
    if (!node.data.class)
      return node;
    if (!node.data.class[NODE_TYPE.NODE])
      return node;

    return setupRelationHandler (node);
  });

  // 下一个中间件
  next(userState);
};