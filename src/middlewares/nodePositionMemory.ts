import { Stage, PatchBehavior, TopoData, Middleware, Position, } from '../../typings/defines';
import { setupEventHandler, findGroup, parseTranslate, toTranslate, } from '../utils';

import createStore from '../store';
import { VNode, } from 'snabbdom/vnode';

const store = createStore('TEMP_POSITION');

const handleMouseUp = (event: MouseEvent): MouseEvent => {
  const gElement = findGroup(event);

  if (!gElement)
    return event;

  try {
    const pos = parseTranslate(gElement.style.transform);
    store.write<Position>(gElement.id, pos);
  } catch (error) {
  }

  return event;
};

const setupMouseupHandler = setupEventHandler(handleMouseUp)('mouseup');

export const nodePositionMemory: Middleware = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  const root = stage.stageNode();
  const children = root.children as VNode[];

  if (children) {
    children.forEach((item: VNode) => {
      const node = item as VNode;
      if (!node.data || !node.data.attrs)
        return;

      const id = node.data.attrs.id;
      const position = store.read<Position>(id as string);
      if (!position)
        return;

      node.data.style.transform = toTranslate(position);
    });
  }

  setupMouseupHandler(root);

  next(userState);
};