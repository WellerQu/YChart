import { 
  Strategy, 
  Subscriber, 
  UpdateBehavior, 
  TopoData, 
  Node, 
  Line, 
  EventOption, 
  ViewboxOption, 
} from '../typings/defines';

import { NODE_TYPE, } from './NODE_TYPE';

import compose from './compose';
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

import applyMiddlewares from './applyMiddlewares';
import createStage from './createStage';

import createMergeAdapter from './adapters/createMergeNodeAdapter';
import createFixAdapter from './adapters/createFixTopoDataAdapter';
import clone from './clone';

import createImageNode from './components/createImageNode';
import createImageNodeOption from './adapters/createImageNodeOptionAdapter';

import createServiceNode from './components/createServiceNode';
import createCrossAppNode from './components/createCrossAppNode';
import createNoDataNode from './components/createNoDataNode';
import createServiceNodeAdapter from './adapters/createServiceNodeOptionAdapter';

import createArrowLine from './components/createArrowLine';
import createNoDataLine from './components/createNoDataLine';
import createArrowLineOption from './adapters/createArrowLineOptionAdapater';

const emptyPadding = (data: TopoData) => {
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
    event(eventOption),
    nodeGroupLayout, 
    nodeCircleLayout,
    scaleCanvas, 
    moveCanvas, 
    moveNode, 
    nodePositionMemory, // 暂停开发这个功能
    // topoMotion,
    topoStyle, 
  );
  const createStageAt = enhancer(createStage);
  const { create, subscribe, patch, viewbox, stageNode, } = createStageAt(container);

  updated && subscribe(updated);

  patch();

  // Expose update method
  return (data: TopoData, option?: ViewboxOption): void => {
    const root = stageNode();
    root.data.attrs.id = elementID;

    viewbox(option);

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
