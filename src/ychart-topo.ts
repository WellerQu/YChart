import { StrategyFn, SubscriberFn, UpdateFn, TopoData, Node, Line, EventOption, SvgOption, } from '../typings/defines';

import { NODE_TYPE, } from './NODE_TYPE';

import compose from './compose';
import { log, } from './middlewares/log';
import { interaction, } from './middlewares/interaction';
import { nodeLayout, } from './middlewares/nodeLayout';
import { topoStyle, } from './middlewares/topoStyle';
import { scaleCanvas, } from './middlewares/scaleCanvas';
import { moveCanvas, } from './middlewares/moveCanvas';
import { moveNode, } from './middlewares/moveNode';
import { event, } from './middlewares/event';

import applyMiddlewares from './applyMiddlewares';
import createStage from './createStage';

import createMergeAdapter from './adapters/createMergeNodeAdapter';
import createFixAdapter from './adapters/createFixTopoDataAdapter';
import clone from './clone';

import createImageNode from './components/createImageNode';
import createImageNodeOption from './adapters/createImageNodeOptionAdapter';

import createServiceNode from './components/createServiceNode';
import createServiceNodeAdapter from './adapters/createServiceNodeOptionAdapter';

import createArrowLine from './components/createArrowLine';
import createArrowLineOption from './adapters/createArrowLineOptionAdapater';

const formatDataAdapter = compose<TopoData>(
  createFixAdapter,
  createMergeAdapter,
  (data: TopoData) => {
    if (!data.nodes)
      data.nodes = [];
    if (!data.links)
      data.links = [];
    
    return data;
  },
  clone,
);

const imageNode = compose<StrategyFn>(
  createImageNode,
  createImageNodeOption,
);

const serviceNode = compose<StrategyFn>(
  createServiceNode,
  createServiceNodeAdapter,
);

const arrowLine = compose<StrategyFn>(
  createArrowLine,
  createArrowLineOption,
);

// Entrance, start from here
export default (container: HTMLDivElement, eventOption?: EventOption, updated?: SubscriberFn): UpdateFn<TopoData> => {
  const elementID = container.id;
  const enhancer = applyMiddlewares(log, nodeLayout, interaction, topoStyle, 
    scaleCanvas, moveCanvas, moveNode, event(eventOption),);
  const createStageAt = enhancer(createStage);
  const { create, subscribe, patch, size, } = createStageAt(container);

  updated && subscribe(updated);

  patch();

  // Expose update method
  return (data: TopoData, option?: SvgOption): void => {
    const root = size(option);
    root.data.attrs.id = elementID;

    const formattedData: TopoData = formatDataAdapter(data);

    // map every node to strategy function which return a VNode
    formattedData.nodes.forEach((item: Node) => {
      if (item.type === NODE_TYPE.SERVER) {
        create(serviceNode(item));
      } else {
        create(imageNode(item));
      }
    });

    // map every line to strategy function which return a VNode
    formattedData.links.forEach((item: Line) => {
      create(arrowLine(item));
    });

    patch(formattedData);
  };
};
