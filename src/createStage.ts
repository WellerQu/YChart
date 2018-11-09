/// <reference path="../node_modules/snabbdom/tovnode.d.ts" />
/// <reference path="../node_modules/snabbdom/vnode.d.ts" />
/// <reference path="../node_modules/snabbdom/snabbdom.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/attributes.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/style.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/class.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/eventlisteners.d.ts" />

import toNode from 'snabbdom/tovnode';
import { VNode, } from 'snabbdom/vnode';
import { init, } from 'snabbdom/snabbdom';
import attributes from 'snabbdom/modules/attributes';
import style from 'snabbdom/modules/style';
import classes from 'snabbdom/modules/class';
import eventlistener from 'snabbdom/modules/eventlisteners';

import { Stage, Subscriber, Strategy, Viewbox, Size, } from '../typings/defines';
import { createSvg, } from './components/components';

const vPatch = init([
  classes,
  style,
  attributes,
  eventlistener,
]);

function createStage (container: HTMLElement): Stage {
  const viewboxOption: Viewbox = {
    x: 0,
    y: 0,
    width: container.parentElement.offsetWidth,
    height: container.parentElement.offsetHeight,
  };
  const sizeOption: Size = {
    width: container.parentElement.offsetWidth,
    height: container.parentElement.offsetHeight,
  };

  let currentNode: VNode = createSvg({
    size: sizeOption,
    viewbox: viewboxOption,
  });
  let previousNode: VNode = toNode(container);
  let subscribers: Subscriber[] = [];

  function create (strategy: Strategy): VNode {
    return strategy(currentNode);
  }

  function subscribe (handler: Subscriber): () => void {
    subscribers.push(handler);

    return () => subscribers = subscribers.filter(fn => fn !== handler);
  }

  function stageNode (): VNode {
    return currentNode;
  }

  function patch (userState?: any): VNode {
    previousNode = vPatch(previousNode, currentNode);
    currentNode = createSvg({
      size: sizeOption,
      viewbox: viewboxOption,
    });

    subscribers.forEach((handler: Subscriber) => handler(userState));

    return previousNode;
  }

  function viewbox (option?: Viewbox): Viewbox {
    const root = stageNode();

    if (option) {
      const { x, y, width, height, } = option;
    
      root.data.attrs.viewBox = [x, y, width, height,].join(',');

      viewboxOption.x = x;
      viewboxOption.y = y;
      viewboxOption.width = width;
      viewboxOption.height = height;
    }

    return viewboxOption;
  }

  function size (option?: Size): Size {
    const root = stageNode();
    if (option) {
      const { width , height, } = option;
      root.data.attrs.width = width;
      root.data.attrs.height = height;

      sizeOption.width = width;
      sizeOption.height = height;
    }

    return sizeOption; 
  }

  return {
    stageNode,
    viewbox,
    size,
    create,
    subscribe,
    patch,
  };
}

export default createStage;
