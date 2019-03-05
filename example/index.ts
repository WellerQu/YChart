import json from './topo.json';

import { VNode, } from 'snabbdom/vnode';
import * as topoInstance from '../src/ychart-topo';
import { TOPO_LAYOUT_STATE, } from '../src/constants/constants';

import * as stackInstance from '../src/ychart-stack';

topoInstance.render(json);
stackInstance.render();

// // 以下为测试代码
const handle1 = (event: Event, sender: VNode) => {
  console.log(event, sender);
};
const handle2 = (event: Event, sender: VNode) => {
  console.log(event, sender);
};

topoInstance.addEventListener('click', handle1);
topoInstance.addEventListener('click', handle2);
topoInstance.removeEventListener('click', handle1);

const $ = (selector: string) => document.querySelector(selector);

$('#layout-ci').addEventListener('click', () => {
  topoInstance.layout(TOPO_LAYOUT_STATE.CIRCLE);
  topoInstance.render(json);
});

$('#layout-fd').addEventListener('click', () => {
  topoInstance.layout(TOPO_LAYOUT_STATE.FORCE_DIRECTED);
  topoInstance.render(json);
});

$('#layout-hc').addEventListener('click', () => {
  topoInstance.layout(TOPO_LAYOUT_STATE.HONEY_COMB);
  topoInstance.render(json);
});

$('#scale').addEventListener('change', (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  topoInstance.scale(+value);
  topoInstance.render(json);
});