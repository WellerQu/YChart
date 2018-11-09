import { Stage, PatchBehavior, TopoData, Middleware, Position, Store, } from '../../typings/defines';
import { setupEventHandler, findGroup, parseTranslate, toTranslate, updateLinePoistion, } from '../utils';

import createStore from '../store';
import { VNode, } from 'snabbdom/vnode';
import { NODE_TYPE, } from '../NODE_TYPE';
import compose from '../compose';
import { ID_COMBINER, } from '../constants';

const store = createStore('TEMP_POSITION');

const restorePosition = (nodes: VNode[], store: Store): ( VNode| string )[] => {
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
      }

      positionMap.set(id, position);
    });
  }

  if (lineGroup.length > 0) {
    lineGroup.forEach((item: VNode) => {
      const id = item.data.attrs.id as string;
      const [source, target,] = id.split(ID_COMBINER);
      if (!positionMap.has(source))
        return;
      if (!positionMap.has(target))
        return;

      const start = positionMap.get(source);
      const end = positionMap.get(target);
      updateLinePoistion(item, start, end);
    });
  }

  return [
    ...lineGroup,
    ...restGroup,
    ...nodeGroup,
  ];
};

export const nodePositionMemory: Middleware = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  const root = stage.stageNode();
  root.children = restorePosition(root.children as VNode[], store);

  let currentGElement: HTMLElement = null;

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