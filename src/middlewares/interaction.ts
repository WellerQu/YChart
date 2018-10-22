import { Stage, PatchFn, TopoData } from '../../typings/defines';
import { VNode } from '../../node_modules/snabbdom/vnode';
import { NODE_TYPE } from '../NODE_TYPE';

import compose from '../compose';

interface SVGAnimateMotionElement extends Element {
  beginElement(): void;
  endElement(): void;
}

const handleMouseEnter = (event: MouseEvent): MouseEvent => {
  console.log('enter', event.target);
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

const setupEventHandler = (handler: (event: MouseEvent) => MouseEvent) => (eventName: string) => (vnode: VNode) => {
  if (!vnode.data.on) {
    vnode.data.on = {};
  }

  if (vnode.data.on[eventName]) {
    vnode.data.on[eventName] = compose<void>(vnode.data.on.mouseenter, handler);
  } else {
    vnode.data.on[eventName] = handler;
  }
}

const setupMouseEnter = setupEventHandler(handleMouseEnter)('mouseenter');
const setupMouseOut = setupEventHandler(handleMouseOut)('mouseout');

// Example for middleware that show how to add an interaction
export const interaction = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  const root = stage.getStageNode();
  const children = root.children;

  children.forEach((item: VNode) => {
    const node: VNode = item as VNode;
    if (!node.data)
      return;

    if (!node.data.class[NODE_TYPE.LINE])
      return;

    setupMouseEnter(node);
    setupMouseOut(node);
  });
  
  next(userState);
};

