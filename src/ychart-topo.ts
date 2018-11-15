/**
 * @module instances
 */

import { 
  Strategy, 
  Subscriber, 
  UpdateBehavior, 
  TopoData, 
  Node, 
  Line, 
  EventOption, 
  Viewbox, 
} from '../typings/defines';

import compose from './compose';
import clone from './clone';

import { log, } from './middlewares/log';
import { nodeGroupLayout, } from './middlewares/nodeGroupLayout';
import { nodeCircleLayout,} from './middlewares/nodeCircleLayout';
import { topoStyle, } from './middlewares/topoStyle';
import { scaleCanvas, } from './middlewares/scaleCanvas';
import { moveCanvas, } from './middlewares/moveCanvas';
import { moveNode, } from './middlewares/moveNode';
import { event, } from './middlewares/event';
import { showLoading, } from './middlewares/showLoading';
import { nodePositionMemory,} from './middlewares/nodePositionMemory';

import createMergeAdapter from './adapters/createMergeNodeAdapter';
import createServiceNodeAdapter from './adapters/createServiceNodeOptionAdapter';
import createFixAdapter from './adapters/createFixTopoDataAdapter';
import createArrowLineOption from './adapters/createArrowLineOptionAdapter';
import createImageNodeOption from './adapters/createImageNodeOptionAdapter';

import applyMiddlewares from './cores/applyMiddlewares';
import createStage from './cores/createStage';

import createImageNode from './components/createImageNode';

import createServiceNode from './components/createServiceNode';
import createCrossAppNode from './components/createCrossAppNode';
import createNoDataNode from './components/createNoDataNode';

import createArrowLine from './components/createArrowLine';
import createNoDataLine from './components/createNoDataLine';
import { showRelation, } from './middlewares/showRelation';
import { NODE_TYPE, } from './constants/constants';

const emptyPadding = (data: TopoData) => {
  if (!data)
    return data = { nodes: [], links: [],};

  if (!data.nodes)
    data.nodes = [];
  if (!data.links)
    data.links = [];
    
  return data;
};

const formatDataAdapter = compose<TopoData>(
  createFixAdapter,
  createMergeAdapter,
  emptyPadding,
  clone,
);

const imageNode = compose<Strategy>(
  createImageNode,
  createImageNodeOption,
);

const serviceNode = compose<Strategy>(
  createServiceNode,
  createServiceNodeAdapter,
);

const crossAppNode = compose<Strategy>(
  createCrossAppNode,
  createServiceNodeAdapter,
);

const noDataNode = compose<Strategy>(
  createNoDataNode,
  createServiceNodeAdapter,
);

const arrowLine = compose<Strategy>(
  createArrowLine,
  createArrowLineOption,
);

const noDataLine = compose<Strategy>(
  createNoDataLine,
  createArrowLineOption,
);

// Entrance, start from here
export default (
  // 容器
  container: HTMLDivElement,
  // 事件配置
  eventOption?: EventOption, 
  // 更新后回调
  updated?: Subscriber,
  // 不显示数据
  isNoData = false,
): UpdateBehavior<TopoData> => {
  const elementID = container.id;
  const enhancer = applyMiddlewares(
    log,
    showLoading,
    showRelation,
    event(eventOption),
    nodeGroupLayout,
    nodeCircleLayout,
    nodePositionMemory,
    scaleCanvas,
    moveCanvas,
    moveNode,
    topoStyle,
  );
  const createStageAt = enhancer(createStage);
  const { create, subscribe, patch, viewbox, size, stageNode, } = createStageAt(container);

  updated && subscribe(updated);

  patch();

  // Expose update method
  return (data: TopoData, option?: Viewbox): void => {
    const root = stageNode();
    root.data.attrs.id = elementID;

    viewbox(option);
    size(option);

    const formattedData: TopoData = formatDataAdapter(data);
    // map every line to strategy function which return a VNode
    formattedData.links.forEach((item: Line) => {
      create(isNoData ? noDataLine(item) : arrowLine(item));
    });

    // map every node to strategy function which return a VNode
    formattedData.nodes.forEach((item: Node) => {
      if (item.crossApp)
        create(crossAppNode(item));
      else if (item.type === NODE_TYPE.SERVER) 
        create(isNoData ? noDataNode(item) : serviceNode(item));
      else 
        create(imageNode(item));
    });

    patch(formattedData);
  };
};
