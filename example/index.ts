import ychartTopo from '../src/ychart-topo';
import ychartCallstack from '../src/ychart-callstack';
import { TopoData, CallstackData, Line, Node, } from '../src/@types';
import topoJson from './topo.json';
import stackJson from './stack.json';
import { TOPO_OPERATION_STATE, } from '../src/constants/constants';

const eventOption = {
  nodeClick: (event: Event, data: Node | Line): void => {
    console.log(event, data);
  },
  // 'lineClick': (event: MouseEvent, data: Line): void => { console.log(event, data); },
  // 'nodeMouseOver': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'nodeMouseOut': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'lineMouseOver': (event: MouseEvent, data: Line): void => { console.log(event, data); },
  // 'lineMouseOut': (event: MouseEvent, data: Node): void => { console.log(event, data); },
};

const updateTopo = ychartTopo(
  document.querySelector('#topo'),
  eventOption,
  false,
  () => TOPO_OPERATION_STATE.NONE,
  (userState?: any) => {
    console.log("updated successfully", userState); // eslint-disable-line
  },
);

const topoData: TopoData = topoJson.data;

updateTopo(topoData);

const btnUpdate = document.querySelector('button#updateTopoData');
btnUpdate.addEventListener('click', () => {
  topoData.nodes[0].instances = (Math.random() * 10) >> 0;
  updateTopo(topoData, null, false);
});

const btnFullscreen = document.querySelector('button#fullTopoData');
btnFullscreen.addEventListener('click', () => {
});

const updateCallstack = ychartCallstack(document.querySelector('#callstack'));

updateCallstack(stackJson.data.spans);

// document.querySelector('svg#callstack').addEventListener('stackclick', (event) => {
//   console.log(event);
// });

// document.querySelector('svg#callstack').addEventListener('redraw', () => {
//   console.log(stackJson.data.spans);
//   updateCallstack(stackJson.data.spans);
// });