import { VNode } from '../node_modules/snabbdom/vnode';
import { init } from '../node_modules/snabbdom/snabbdom';
import attributes from '../node_modules/snabbdom/modules/attributes';
import style from '../node_modules/snabbdom/modules/style';
import classes from '../node_modules/snabbdom/modules/class';
import eventlistener from '../node_modules/snabbdom/modules/eventlisteners';

import { Stage, SubscriberFn, StrategyFn } from '../typings/defines';
import { createSvg } from './components/components';

const vPatch = init([
  classes,
  style,
  attributes,
  eventlistener
]);

function createStage(initNode: VNode): Stage {
  let currentNode: VNode = createSvg();
  let previousNode: VNode = initNode;
  let subscribers: SubscriberFn[] = [];

  function create(strategy: StrategyFn): VNode {
    return strategy(currentNode);
  }

  function subscribe(handler: SubscriberFn): () => void {
    subscribers.push(handler);

    return () => { subscribers = subscribers.filter(fn => fn !== handler) };
  }

  function getStageNode(): VNode {
    return currentNode;
  }

  function patch(userState?: any): VNode {
    previousNode = vPatch(previousNode, currentNode);
    currentNode = createSvg();

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
