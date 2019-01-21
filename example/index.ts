import json from './topo.json';

import createInstance from '../src/cores/createInstance';
import applyMiddlewares from '../src/cores/applyMiddlewares';
import log from '../src/middlewares/log';
import scaleCanvas from '../src/middlewares/scaleCanvas';
import nodeHoneycombLayout from '../src/middlewares/nodeHoneycombLayout';
import nodeForceDirectedLayout from '../src/middlewares/nodeForceDirectedLayout';
import nodeCircleLayout from '../src/middlewares/nodeCircleLayout';
import linkNode from '../src/middlewares/linkNode';

import  fixData from '../src//adapters/createFixTopoDataAdapter';
import { mergeUsers, mergeHTTPOrRPC, } from '../src/adapters/createMergeNodeAdapter';


import application from '../src/components/applicationNode';
import service from '../src/components/serviceNode';
import user from '../src/components/userNode';
import { TopoData, } from '../typings/defines.js';
import { UpdateBehavior, Node, } from '../src/cores/core';
import { NODE_TYPE, TOPO_LAYOUT_STATE, } from '../src/constants/constants';

import applicationAdapter from '../src/adapters/applicationAdapter';
import serviceAdapter from '../src/adapters/serviceAdapter';

import io from '../src/cores/io';
import functor from '../src/cores/functor';
import left from '../src/cores/left';
import right from '../src/cores/right';
import sideEffect from '../src/cores/sideEffect';

import { VNode, } from 'snabbdom/vnode';

// parameters
let shouldMergeNode = true;
let showAsApp = false;
let layoutStrategy = TOPO_LAYOUT_STATE.CIRCLE;

const enhancer = applyMiddlewares(log, nodeHoneycombLayout, nodeCircleLayout, nodeForceDirectedLayout, linkNode, scaleCanvas);
const topoInstance = enhancer(createInstance);

const { update, layout, patch, addEventListener, scale, reset, } = topoInstance({
  size: {
    width: 800,
    height: 600,
  },
  viewbox: [0, 0, 800, 600,],
  container: document.querySelector('#topo'),
});

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

addEventListener('click', (event: Event, sender: VNode) => {
  console.log(event, sender);
});

// 以下为测试代码
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