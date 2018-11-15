/**
 * @module middlewares
 */

import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import { setupEventHandler, findGroup, findRoot, } from '../utils';
import { ID_COMBINER, NODE_TYPE, } from '../constants/constants';
import compose from '../compose';

type Child =  string | VNode;

export const showRelation = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  if (!userState)
    return next(userState);
  if (userState.nodes.length === 0)
    return next(userState);

  const map = new Map<string, HTMLElement>();

  const handleMouseEnter = (event: MouseEvent):MouseEvent => {
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

  const setupMouseEnterHandler = setupEventHandler(handleMouseEnter)('mouseenter');
  const setupMouseLeaveHandler = setupEventHandler(handleMouseLeave)('mouseleave');

  const root = stage.stageNode();
  const children = root.children;

  root.children = children.map((item: Child) => {
    const node = item as VNode;
    if (!node.data)
      return node;
    
    return compose<VNode>(
      setupMouseEnterHandler,
      setupMouseLeaveHandler,
    )(node);
  });

  next(userState);
};