/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module middlewares
 */

import { VNode, } from 'snabbdom/vnode';

import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import { setupEventHandler, } from '../utils';
import { NODE_TYPE, } from '../constants/constants';

interface SVGAnimateMotionElement extends Element {
  beginElement(): void;
  endElement(): void;
}

const handleMouseEnter = (event: MouseEvent): MouseEvent => {
  // target is SVGGElement
  const gElement = event.target as SVGGElement;
  if (!gElement.querySelector)
    return event;

  const pathElement = gElement.querySelector('path') as SVGPathElement;
  if (!pathElement.getAttribute)
    return event;

  const animateMotionElement = gElement.querySelector('animateMotion') as SVGAnimateMotionElement;
  if (!animateMotionElement.beginElement)
    return event;

  animateMotionElement.setAttribute('path', pathElement.getAttribute('d'));
  // animateMotionElement.beginElement();

  return event;
};

const handleMouseOut = (event: MouseEvent): MouseEvent => {
  // target is SVGPathElement
  const pathElement = event.target as SVGPathElement;
  const animateMotionElement = pathElement.parentElement.querySelector('animateMotion') as SVGAnimateMotionElement;
  if (!animateMotionElement.endElement)
    return event;

  animateMotionElement.endElement();

  return event;
};

const setupMouseEnterHandler = setupEventHandler(handleMouseEnter)('mouseenter');
const setupMouseOutHandler = setupEventHandler(handleMouseOut)('mouseout');

// Example for middleware that show how to add an interaction
export const interaction = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  console.log('TODO: add interaction'); // eslint-disable-line

  const root = stage.stageNode();
  const children = root.children;

  children.forEach((item: VNode) => {
    const node: VNode = item as VNode;
    if (!node.data)
      return;

    if (!node.data.class[NODE_TYPE.LINE])
      return;

    setupMouseEnterHandler(node);
    setupMouseOutHandler(node);
  });

  next(userState);
};

