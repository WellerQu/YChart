/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { Stage, PatchBehavior, TopoData, Middleware, Position, Store, Size, Viewbox, } from '../../typings/defines';
import { setupEventHandler, findGroup, parseTranslate, toTranslate, updateLinePosition, } from '../utils';

import { VNode, } from 'snabbdom/vnode';
import createStore from '../store';
import compose from '../compose';
import { NODE_TYPE, } from '../constants/constants';

const store = createStore('TEMP_POSITION');

/**
 * 从本地存储中同步各个节点的坐标 
 */
const syncPosition = (nodes: VNode[], store: Store, viewbox: Viewbox, size: Size): ( VNode| string )[] => {
  const nodeGroup: VNode[] = [];
  const lineGroup: VNode[] = [];
  const restGroup: ( VNode | string )[] = [];

  const positionMap = new Map<string, Position>();

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

    if (classNames[NODE_TYPE.NODE]) {
      nodeGroup.push(node);
      continue;
    }

    restGroup.push(node);
  }

  if (nodeGroup.length > 0) {
    nodeGroup.forEach((item: VNode) => {
      const id = item.data.attrs.id as string;
      let position = store.read<Position>(id);
      if (position) {
        item.data.style.transform = toTranslate(position);
      } else {
        position = parseTranslate(item.data.style.transform as string);
        try {
          store.write(id, position);
        }
        catch (error) {
          console.error(error); // eslint-disable-line
        }
      }

      positionMap.set(id, position);
    });
  }

  return [
    ...lineGroup,
    ...restGroup,
    ...nodeGroup,
  ];
};

/**
 * 部署事件,记录每次拖拽节点后节点的本地坐标
 */
export const nodePositionMemory: Middleware = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  const size = stage.size();
  if (!size.width || !size.height)
    return next(userState);

  const viewbox = stage.viewbox();
  const root = stage.stageNode();
  let currentGElement: HTMLElement = null;

  root.children = syncPosition(root.children as VNode[], store, viewbox, size);

  const handleMouseDown = (event: MouseEvent): MouseEvent => {
    currentGElement  = findGroup(event);
    return event;
  };

  const handleMouseUp = (event: MouseEvent): MouseEvent => {
    if (!currentGElement) 
      return event;
 
    try {
      const pos = parseTranslate(currentGElement.style.transform);
      store.write<Position>(currentGElement.id, pos);
    } catch (error) {
      console.error(error); // eslint-disable-line
    }

    return event;
  };

  const setupMemoryHandler = compose<VNode>(
    setupEventHandler(handleMouseUp)('mouseup'),
    setupEventHandler(handleMouseDown)('mousedown'),
  );
  setupMemoryHandler(root);

  next(userState);
};