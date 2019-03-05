/**
 * @module instances
 */

import createInstance from '../src/cores/createInstance';
import applyMiddlewares from '../src/cores/applyMiddlewares';
import log from '../src/middlewares/log';
import scaleCanvas from '../src/middlewares/scaleCanvas';
import nodeHoneycombLayout from '../src/middlewares/nodeHoneycombLayout';
import nodeForceDirectedLayout from '../src/middlewares/nodeForceDirectedLayout';
import nodeCircleLayout from '../src/middlewares/nodeCircleLayout';
import linkNode from '../src/middlewares/linkNode';
import moveNode from '../src/middlewares/moveNode';
import moveCanvas from '../src/middlewares/moveCanvas';
import topoStyle from '../src/middlewares/topoStyle';
import relationship from '../src/middlewares/relationship';
import positionCache from '../src/middlewares/positionCache';

import  fixData from './adapters/fixTopoDataAdapter';
import { mergeUsers, mergeHTTPOrRPC, } from './adapters/mergeNodeAdapter';

import application from '../src/components/applicationNode';
import service from '../src/components/serviceNode';
import user from '../src/components/userNode';
import terminalNode from '../src/components/terminalNode';
import { TopoData, } from '../typings/defines.js';
import { UpdateBehavior as AddBehavior, Node, InstanceState, } from '../src/cores/core';
import { NODE_TYPE, TOPO_OPERATION_STATE, TOPO_LAYOUT_STATE, } from './constants/constants';

import applicationAdapter from '../src/adapters/applicationAdapter';
import serviceAdapter from '../src/adapters/serviceAdapter';

import io from '../src/cores/io';
import functor from '../src/cores/functor';
import left from '../src/cores/left';
import right from '../src/cores/right';
import sideEffect from '../src/cores/sideEffect';
import applyStates from './cores/applyStates';
import id from './cores/id';

// parameters
let shouldMergeNode = true;
let showAsApp = false;

const withMiddlewares = applyMiddlewares(
  log, 
  nodeHoneycombLayout, 
  nodeCircleLayout, 
  nodeForceDirectedLayout, 
  linkNode, 
  scaleCanvas,
  moveNode,
  moveCanvas,
  topoStyle,
  relationship,
  positionCache,
);
const withInitStates = applyStates({
  allowOperations: TOPO_OPERATION_STATE.CAN_MOVE_CANVAS,
  layoutStrategy: TOPO_LAYOUT_STATE.CIRCLE,
  scale: 1,
});

const instance = functor({
  size: {
    width: 1200,
    height: 800,
  },
  viewbox: [0, 0, 800, 600,],
  container: document.querySelector('#topo'),
})
  .map(createInstance)
  .map(withInitStates)
  .map(withMiddlewares)
  .fold(id);

const { add, layout, patch, addEventListener, removeEventListener, scale, operation, } = instance as InstanceState;

const shouldMergeHTTPOrRemote = (should: boolean) => (data: any) => !should ? left(data) : right(data);
const paintToVirtualDOM = (add: AddBehavior) => (data: TopoData) =>  sideEffect(() => {
  const add$ = io(add);
  // side effect
  data.nodes.forEach((item: Node) => {
    if (showAsApp || item.crossApp) 
      add$.map(application).map(applicationAdapter).ap(functor(item));
    else if (item.type === NODE_TYPE.SERVER)
      add$.map(service).map(serviceAdapter).ap(functor(item));
    else if (item.type === NODE_TYPE.USER)
      add$.map(user).ap(functor(item));
    else {
      add$.map(terminalNode).ap(functor(item));
    }
  });

  return data;
});

const render = (json: { data: any }) => functor(json)
  .map((x: any) => x.data)
  .map(fixData)
  .map(mergeUsers)
  .chain(shouldMergeHTTPOrRemote(shouldMergeNode))
  .map(mergeHTTPOrRPC)
  .chain(paintToVirtualDOM(add))
  .fold(patch);

export {
  layout,
  operation,
  addEventListener, 
  removeEventListener, 
  scale,
  render
};