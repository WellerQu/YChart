/// <reference path="../node_modules/snabbdom/tovnode.d.ts" />
/// <reference path="../node_modules/snabbdom/vnode.d.ts" />
/// <reference path="../node_modules/snabbdom/snabbdom.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/attributes.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/style.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/class.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/eventlisteners.d.ts" />

import toNode from 'snabbdom/tovnode';
import { VNode } from 'snabbdom/vnode';
import { init } from 'snabbdom/snabbdom';
import attributes from 'snabbdom/modules/attributes';
import style from 'snabbdom/modules/style';
import classes from 'snabbdom/modules/class';
import eventlistener from 'snabbdom/modules/eventlisteners';

import { Stage, SubscriberFn, StrategyFn, SvgOption } from '../typings/defines';
import { createSvg } from './components/components';

const vPatch = init([
  classes,
  style,
  attributes,
  eventlistener
]);

function createStage(container: HTMLElement): Stage {
  const svgOption: SvgOption = {
    width: container.parentElement.offsetWidth,
    height: container.parentElement.offsetHeight,
  };

  let currentNode: VNode = createSvg(svgOption);
  let previousNode: VNode = toNode(container);
  let subscribers: SubscriberFn[] = [];

  function create(strategy: StrategyFn): VNode {
    return strategy(currentNode);
  }

  function subscribe(handler: SubscriberFn): () => void {
    subscribers.push(handler);

    return () => subscribers = subscribers.filter(fn => fn !== handler);
  }

  function getStageNode(): VNode {
    return currentNode;
  }

  function patch(userState?: any): VNode {
    previousNode = vPatch(previousNode, currentNode);
    currentNode = createSvg(svgOption);

    subscribers.forEach((handler: SubscriberFn) => handler(userState));

    return previousNode;
  }

  return {
    getStageNode,
    create,
    subscribe,
    patch
  };
}

export default createStage;
