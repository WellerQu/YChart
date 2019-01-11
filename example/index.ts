import json from './topo.json';

import io from '../src/cores/io';
import functor from '../src/cores/functor';
import createInstance from '../src/cores/createInstance';
import applyMiddlewares from '../src/cores/applyMiddlewares';
import log from '../src/middlewares/log';

const enhancer = applyMiddlewares(log);
const topoInstance = enhancer(createInstance);

const { update, patch, scale, reset, } = topoInstance({
  size: {
    width: 800,
    height: 600,
  },
  viewbox: [0, 0, 800, 600,],
  container: document.querySelector('#topo'),
});

import application from '../src/components/application';
import service from '../src/components/service';
import id from '../src/cores/id';
import { TopoData, } from '../src/cores/core.js';

reset();

const f = functor(json);
// update(application({ id: '321', title: '三方外卖', instancesCount: 2, tierCount: void 0,}));

f.map(( data: TopoData ) => {
});
update(
  service({
    id: '321',
    title: 'Website',
    fill: '#CC0000',
    activeInstanceCount: 2,
    instanceCount: 13,
    type: 'php',
  })
);

const $root = io(patch)
  .map((x: any) => x)
  .map((x: any) => x)
  .ap(f)
  .fold(id);

console.log($root); // eslint-disable-line

scale(1 / 0.5);