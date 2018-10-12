import { VNode } from '../node_modules/snabbdom/vnode';
import toNode from '../node_modules/snabbdom/tovnode';
import { StrategyFn, SubscriberFn, UpdateFn, TopoData, Stage, Node, Line } from '../typings/defines';

import { NODE_TYPE } from './NODE_TYPE';

import compose from './compose';
import { log } from './middlewares/log';
import { event } from './middlewares/event';
import { layout } from './middlewares/layout';
import { style } from './middlewares/style';

import applyMiddlewares from './applyMiddlewares';
import createStage from './createStage';

import createMergeAdapter from './adapters/createMergeAdapter';
import createFixAdapter from './adapters/createFixAdapter';
import clone from './clone';

import { createImageNode } from './components/createImageNode';
import createImageNodeOption from './adapters/createImageNodeOption';

const imageNode = compose<StrategyFn>(
  createImageNode,
  createImageNodeOption,
);

const formatDataAdapter = compose<TopoData>(
  createFixAdapter,
  createMergeAdapter,
  clone,
);

// Entrance, start from here
export default (container: HTMLDivElement, updated?: SubscriberFn): UpdateFn => {
  const enhancer = applyMiddlewares(log, event, layout, style);
  const createStageAt = compose<Stage>(
    enhancer(createStage),
    toNode
  );
  const { create, subscribe, patch } = createStageAt(container);

  updated && subscribe(updated);

  patch();

  // update
  return (data: TopoData): void => {
    const formattedData: TopoData = formatDataAdapter(data);

    formattedData.nodes.forEach((item: Node) => {
      if (item.type === NODE_TYPE.USER) {
        create(imageNode(item));
      }
    });

    formattedData.links.forEach((item: Line) => {
    });

    patch(formattedData);
  };
};
