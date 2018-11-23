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
import { nodeForceDirectedLayout, } from './middlewares/nodeForceDirectedLayout';
import { topoStyle, } from './middlewares/topoStyle';
import { scaleCanvas, } from './middlewares/scaleCanvas';
import { moveCanvas, } from './middlewares/moveCanvas';
import { moveNode, } from './middlewares/moveNode';
import { event, } from './middlewares/event';
import { showLoading, } from './middlewares/showLoading';
import { nodePositionMemory,} from './middlewares/nodePositionMemory';
import { linkLine, } from './middlewares/linkLine';

import createMergeAdapter, { mergeUsers, } from './adapters/createMergeNodeAdapter';
import createAppNodeAdapter from './adapters/createAppNodeOptionAdapter';
import createServiceNodeAdapter from './adapters/createServiceNodeOptionAdapter';
import createFixAdapter from './adapters/createFixTopoDataAdapter';
import createArrowLineOption from './adapters/createArrowLineOptionAdapter';
import createImageNodeOption from './adapters/createImageNodeOptionAdapter';

import applyMiddlewares from './cores/applyMiddlewares';
import createStage from './cores/createStage';

import createImageNode from './components/createImageNode';

import createServiceNode from './components/createServiceNode';
import createAppNode from './components/createAppNode';

import createArrowLine from './components/createArrowLine';
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



const imageNode = compose<Strategy>(
  createImageNode,
  createImageNodeOption,
);

const serviceNode = compose<Strategy>(
  createServiceNode,
  createServiceNodeAdapter,
);

const appNode = compose<Strategy>(
  createAppNode,
  createAppNodeAdapter,
);

const arrowLine = compose<Strategy>(
  createArrowLine,
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
  // 显示为应用程序
  showAsApp = false,
): UpdateBehavior<TopoData> => {
  const elementID = container.id;
  const enhancer = applyMiddlewares(
    log,
    showLoading,
    showRelation,
    event(eventOption),
    nodeGroupLayout,
    nodeCircleLayout,
    nodeForceDirectedLayout,
    nodePositionMemory,
    linkLine,
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
  return (data: TopoData, option?: Viewbox, merged = true): void => {
    const root = stageNode();
    root.data.attrs.id = elementID;

    viewbox(option);
    size(option);

    const formatDataAdapter = compose<TopoData>(
      createFixAdapter,
      merged ? createMergeAdapter : mergeUsers,
      emptyPadding,
      clone,
    );

    const formattedData: TopoData = formatDataAdapter(data);
    // map every line to strategy function which return a VNode
    formattedData.links.forEach((item: Line) => {
      create(arrowLine(item));
    });

    // map every node to strategy function which return a VNode
    formattedData.nodes.forEach((item: Node) => {
      if (showAsApp || item.crossApp) 
        create(appNode(item));
      else if (item.type === NODE_TYPE.SERVER) 
        create(serviceNode(item));
      else 
        create(imageNode(item));
    });

    patch(formattedData);
  };
};
