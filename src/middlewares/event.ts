/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';

import { Stage, PatchBehavior, TopoData, EventOption, TopoEventHandler, } from '../../typings/defines';
import { setupEventHandler, } from '../utils';
import compose from '../compose';
import { NODE_TYPE, } from '../constants/constants';

const handlerHelper = (
  handleNodeEvent: TopoEventHandler,
  handleLineEvent: TopoEventHandler,
  data?: TopoData,
) => (event: MouseEvent): MouseEvent => {
  let element = event.target as HTMLElement;

  if (!element.nodeName) return event;

  while (element.nodeName.toUpperCase() !== 'G' && element.nodeName.toUpperCase() !== 'SVG') {
    element = element.parentElement;
  }

  if (element.classList.contains(NODE_TYPE.NODE)) {
    const node = data
      ? data.nodes.find(n => n.id === element.getAttribute('id'))
      : null;
    handleNodeEvent && handleNodeEvent(event, node);
  } else if (element.classList.contains(NODE_TYPE.LINE)) {
    const line = data
      ? data.links.find(
        n => `${n.source}-${n.target}` === element.getAttribute('id')
      )
      : null;
    handleLineEvent && handleLineEvent(event, line);
  }

  return event;
};

export const event = (options: EventOption ) => (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  const root = stage.stageNode();

  const handleClick = handlerHelper(options['nodeClick'], options['lineClick'], userState);
  const handleMouseOver = handlerHelper(options['nodeMouseOver'], options['lineMouseOver'], userState);
  const handleMouseOut = handlerHelper(options['nodeMouseOut'], options['lineMouseOut'], userState);

  const setupEvent = compose<VNode>(
    setupEventHandler(handleClick)('click'),
    setupEventHandler(handleMouseOut)('mouseout'),
    setupEventHandler(handleMouseOver)('mouseover'),
  );

  setupEvent(root);

  next(userState);
};