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

import { log, } from './middlewares/__log';
import { nodeGroupLayout, } from './middlewares/__nodeGroupLayout';
import { nodeCircleLayout,} from './middlewares/__nodeCircleLayout';
import { nodeForceDirectedLayout, } from './middlewares/__nodeForceDirectedLayout';
import { topoStyle, } from './middlewares/__topoStyle';
import { scaleCanvas, } from './middlewares/__scaleCanvas';
import { moveCanvas, } from './middlewares/__moveCanvas';
import { moveNode, } from './middlewares/__moveNode';
import { event, } from './middlewares/event';
import { showLoading, } from './middlewares/__showLoading';
import { nodePositionMemory,} from './middlewares/nodePositionMemory';
import { linkLine, } from './middlewares/__linkLine';

import createMergeAdapter, { mergeUsers, } from './adapters/createMergeNodeAdapter';
import createAppNodeAdapter from './adapters/createAppNodeOptionAdapter';
import createServiceNodeAdapter from './adapters/createServiceNodeOptionAdapter';
import createFixAdapter from './adapters/createFixTopoDataAdapter';
import createArrowLineOption from './adapters/createArrowLineOptionAdapter';
import createImageNodeOption from './adapters/createImageNodeOptionAdapter';

import applyMiddlewares from './cores/__applyMiddlewares';
import createStage from './cores/__createStage';

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
  // 显示为应用程序
  showAsApp = false,
  // 获取状态
  getState?: () => number,
  // 更新后回调
  updated?: Subscriber,
): UpdateBehavior<TopoData> => {
  const elementID = container.id;
  const enhancer = applyMiddlewares(
    log,
    showLoading,
    event(eventOption),
    // 基本布局策略
    nodeGroupLayout,
    // 环形布局策略
    nodeCircleLayout,
    // 力导向布局策略
    nodeForceDirectedLayout,
    nodePositionMemory,
    linkLine,
    scaleCanvas,
    moveCanvas(getState),
    moveNode(getState),
    showRelation(getState),
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
