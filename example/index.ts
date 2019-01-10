import json from './topo.json';

import io from '../src/cores/io';
import functor from '../src/cores/functor';
import createInstance from '../src/cores/createInstance';
import applyMiddlewares from '../src/cores/applyMiddlewares';
import log from '../src/middlewares/log';

const enhancer = applyMiddlewares(log);
const topoInstance = enhancer(createInstance);

const { update, patch, scale, } = topoInstance({
  size: {
    width: 800,
    height: 600,
  },
  viewbox: [0, 0, 800, 600,],
  container: document.querySelector('#topo'),
});

import { createText, createGroup, createDoubleText, } from '../src/components/components';

update(createText({ content: '123', x: 0, y: 18,}));
update(createGroup({ id: '123', x: 0, y: 0, }));
update(createDoubleText([{ content: '123', x: 0, y: 36, }, { content: '123', x: 100, y: 36, },]));

io(patch)
  .map((x: any) => x)
  .ap(functor(json));

scale(1 / 0.5);