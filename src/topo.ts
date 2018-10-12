import toNode from '../node_modules/snabbdom/tovnode';
import { SubscriberFn, UpdateFn, TopoData, Stage, Node, Line } from '../typings/defines';

import compose from './compose';
import { log } from './middlewares/log';
import { event } from './middlewares/event';
import { layout } from './middlewares/layout';
import { style } from './middlewares/style';

import applyMiddlewares from './applyMiddlewares';
import createStage from './createStage';

import createMergeNodeAdapter from './adapters/createMergeNodeAdapter';

// Entrance, start from here
export default (container: HTMLDivElement, updated?: SubscriberFn): UpdateFn => {
  const enhancer = applyMiddlewares(log, event, layout, style);
  const createStageAt = compose<Stage>(
    enhancer(createStage),
    toNode
  );
  const { subscribe, patch } = createStageAt(container);

  updated && subscribe(updated);

  patch();

  // update
  return (data: TopoData): void => {
    const formattedData: TopoData = createMergeNodeAdapter(data);

    formattedData.nodes.forEach((item: Node) => {

    });

    formattedData.links.forEach((item: Line) => {

    });

    patch(formattedData);
  };
};
