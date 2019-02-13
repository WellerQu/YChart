import json from './topo.json';

import createInstance from '../src/cores/createInstance';
import applyMiddlewares from '../src/cores/applyMiddlewares';
import applyStates from '../src/cores/applyStates';
import log from '../src/middlewares/log';
import scaleCanvas from '../src/middlewares/scaleCanvas';
import nodeHoneycombLayout from '../src/middlewares/nodeHoneycombLayout';
import nodeForceDirectedLayout from '../src/middlewares/nodeForceDirectedLayout';
import nodeCircleLayout from '../src/middlewares/nodeCircleLayout';
import linkNode from '../src/middlewares/linkNode';
import moveNode from '../src/middlewares/moveNode';
import moveCanvas from '../src/middlewares/moveCanvas';
import topoStyle from '../src/middlewares/topoStyle';

import  fixData from '../src//adapters/createFixTopoDataAdapter';
import { mergeUsers, mergeHTTPOrRPC, } from '../src/adapters/createMergeNodeAdapter';

import application from '../src/components/applicationNode';
import service from '../src/components/serviceNode';
import user from '../src/components/userNode';
import { TopoData, } from '../typings/defines.js';
import { UpdateBehavior, Node, InstanceState, ChartOption, } from '../src/cores/core';
import { NODE_TYPE, TOPO_LAYOUT_STATE, TOPO_OPERATION_STATE, } from '../src/constants/constants';

import applicationAdapter from '../src/adapters/applicationAdapter';
import serviceAdapter from '../src/adapters/serviceAdapter';

import io from '../src/cores/io';
import functor from '../src/cores/functor';
import left from '../src/cores/left';
import right from '../src/cores/right';
import sideEffect from '../src/cores/sideEffect';

import { VNode, } from 'snabbdom/vnode';
import id from '../src/cores/id';

// parameters
let shouldMergeNode = true;
let showAsApp = false;
let layoutStrategy = TOPO_LAYOUT_STATE.CIRCLE;

const enhancerWithMiddlewares = applyMiddlewares(
  log, 
  nodeHoneycombLayout, 
  nodeCircleLayout, 
  nodeForceDirectedLayout, 
  linkNode, 
  scaleCanvas,
  moveNode,
  moveCanvas,
  topoStyle,
);
const enhancerWithInitStates = applyStates({});

const topoInstance = io(enhancerWithMiddlewares)
  .map(enhancerWithInitStates)
  .ap(functor(createInstance)).fold(id) as (option?: ChartOption) => InstanceState;

const { update, layout, patch, addEventListener, removeEventListener, scale, operation, } = topoInstance({
  size: {
    width: 800,
    height: 600,
  },
  viewbox: [0, 0, 800, 600,],
  container: document.querySelector('#topo'),
}) as InstanceState;

const shouldMergeHTTPOrRemote = (should: boolean) => (data: any) => !should ? left(data) : right(data);
const paintToVirtualDOM = (update: UpdateBehavior) => (data: TopoData) =>  sideEffect(() => {
  // side effect
  data.nodes.forEach((item: Node) => {
    if (showAsApp || item.crossApp) 
      io(update).map(application).map(applicationAdapter).ap(functor(item));
    else if (item.type === NODE_TYPE.SERVER)
      io(update).map(service).map(serviceAdapter).ap(functor(item));
    else if (item.type === NODE_TYPE.USER)
      io(update).map(user).ap(functor(item));
    // TODO: handle other type
  });

  return data;
});

const render = (json: { data: any }) => functor(json)
  .map((x: any) => x.data)
  .map(fixData)
  .map(mergeUsers)
  .chain(shouldMergeHTTPOrRemote(shouldMergeNode))
  .map(mergeHTTPOrRPC)
  .chain(paintToVirtualDOM(update))
  .fold(patch);

layout(layoutStrategy);
render(json);

operation(TOPO_OPERATION_STATE.CAN_MOVE_CANVAS)

// 以下为测试代码
const handle1 = (event: Event, sender: VNode) => {
  console.log(event, sender);
};
const handle2 = (event: Event, sender: VNode) => {
  console.log(event, sender);
};

addEventListener('click', handle1);
addEventListener('click', handle2);
removeEventListener('click', handle1);

const $ = (selector: string) => document.querySelector(selector);

$('#layout-ci').addEventListener('click', () => {
  layout(TOPO_LAYOUT_STATE.CIRCLE);
  render(json);
});

$('#layout-fd').addEventListener('click', () => {
  layout(TOPO_LAYOUT_STATE.FORCE_DIRECTED);
  render(json);
});

$('#layout-hc').addEventListener('click', () => {
  layout(TOPO_LAYOUT_STATE.HONEY_COMB);
  render(json);
});

$('#scale').addEventListener('change', (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  scale(+value);
  render(json);
});