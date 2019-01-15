import json from './topo.json';

import createInstance from '../src/cores/createInstance';
import applyMiddlewares from '../src/cores/applyMiddlewares';
import log from '../src/middlewares/log';
import nodeGroupLayout from '../src/middlewares/nodeGroupLayout';

import  fixData from '../src//adapters/createFixTopoDataAdapter';
import { mergeUsers, mergeHTTPOrRPC, } from '../src/adapters/createMergeNodeAdapter';

// parameters
let should = true;
let showAsApp = false;

const enhancer = applyMiddlewares(log, nodeGroupLayout);
const topoInstance = enhancer(createInstance);

const { update, patch, addEventListener, } = topoInstance({
  size: {
    width: 800,
    height: 600,
  },
  viewbox: [0, 0, 800, 600,],
  container: document.querySelector('#topo'),
});

import application from '../src/components/applicationNode';
import service from '../src/components/serviceNode';
import user from '../src/components/userNode';
import { TopoData, } from '../typings/defines.js';
import { UpdateBehavior, Node, } from '../src/cores/core';
import { NODE_TYPE, } from '../src/constants/constants';

import applicationAdapter from '../src/adapters/applicationAdapter';
import serviceAdapter from '../src/adapters/serviceAdapter';

import io from '../src/cores/io';
import functor from '../src/cores/functor';
import left from '../src/cores/left';
import right from '../src/cores/right';
import sideEffect from '../src/cores/sideEffect';


import { VNode, } from 'snabbdom/vnode';

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

functor(json.data)
  .map(fixData)
  .map(mergeUsers)
  .chain(shouldMergeHTTPOrRemote(should))
  .map(mergeHTTPOrRPC)
  .chain(paintToVirtualDOM(update))
  .fold(patch);

addEventListener('click', (event: Event, sender: VNode) => {
  console.log(event, sender);
});