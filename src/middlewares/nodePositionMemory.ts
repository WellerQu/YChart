import { Stage, PatchBehavior, TopoData, Middleware, Position, } from '../../typings/defines';
import { setupEventHandler, findGroup, parseTranslate, toTranslate, updateLinePoistion, } from '../utils';

import createStore from '../store';
import { VNode, } from 'snabbdom/vnode';
import { NODE_SIZE, } from '../constants';
import { NODE_TYPE, } from '../NODE_TYPE';

const store = createStore('TEMP_POSITION');

const handleMouseUp = (event: MouseEvent): MouseEvent => {
  const gElement = findGroup(event);

  if (!gElement)
    return event;

  try {
    const pos = parseTranslate(gElement.style.transform);
    store.write<Position>(gElement.id, pos);
  } catch (error) {
    console.error(error); // eslint-disable-line
  }

  return event;
};

const setupMouseupHandler = setupEventHandler(handleMouseUp)('mouseup');

export const nodePositionMemory: Middleware = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  const root = stage.stageNode();
  const children = root.children as VNode[];

  const nodeGroup: VNode[] = [];
  const lineGroup: VNode[] = [];
  const restGroup: ( VNode | string )[] = [];

  const positionMap = new Map<string, Position>();

  for (let i = 0, len = children.length; i < len; i++) {
    const node: VNode = children[i] as VNode;

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
      const [source, ...target] = id.split('-');
      if (!positionMap.has(source))
        return;
      if (!positionMap.has(target.join('-')))
        return;

      const start = positionMap.get(source);
      const end = positionMap.get(target.join('-'));
      updateLinePoistion(item, start, end);
    });
  }

  setupMouseupHandler(root);

  next(userState);
};