import ychartTopo from '../src/ychart-topo';
import ychartCallstack from '../src/ychart-callstack';
import { TopoData, CallstackData, Line, Node, } from '../src/@types';
import json from './topo.json';
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

const topoData: TopoData = json.data;

updateTopo(topoData);

const btnUpdate = document.querySelector('button#updateTopoData');
btnUpdate.addEventListener('click', () => {
  topoData.nodes[0].instances = (Math.random() * 10) >> 0;
  updateTopo(topoData, null, false);
});

const btnFullscreen = document.querySelector('button#fullTopoData');
btnFullscreen.addEventListener('click', () => {
  
});

const callstackData: CallstackData = {
  spanId: '0',
  appName: 'cba',
  transactionName: 'root stack service',
  elapsedTime: 6, // ms
  timeOffset: 0,
  fill: 'blue',
  children: [
    {
      spanId: '1',
      appName: 'abc',
      transactionName: 'serv 0',
      elapsedTime: 1,
      timeOffset: 0,
      children: [
        {
          spanId: '11',
          appName: 'abc',
          transactionName: 'serv 01',
          elapsedTime: 1,
          timeOffset: 0,
          children: [
            {
              spanId: '111',
              appName: 'abc 1',
              transactionName: 'serv 001',
              elapsedTime: 1,
              timeOffset: 0,
            },
            {
              spanId: '112',
              appName: 'abc 1',
              transactionName: 'serv 002',
              elapsedTime: 1,
              timeOffset: 0,
            },
          ],
        },
        {
          spanId: '12',
          appName: 'abc',
          transactionName: 'serv 02',
          elapsedTime: 3,
          timeOffset: 0,
        },
      ],
    },
    {
      spanId: '2',
      appName: 'abc',
      transactionName: 'serv 1',
      elapsedTime: 44,
      timeOffset: 0,
    },
  ],
};

// import randomColor from 'randomcolor';

// const flatten = (root: CallstackData): CallstackData[] => {
//   const arr = [root];
//   if (root.children) {
//     return root.children.reduce((arr, item) => {
//       return arr.concat(flatten(item));
//     }, arr);
//   }
//   return arr;
// };

// const stacks = flatten(callstackData);
// const colursMap = stacks.reduce((map, item) => {
//   if (!map.has(item.appName))
//     map.set(item.appName, randomColor({ hue: '#338cff' }));
//   return map;
// }, new Map<string, string>());

const updateCallstack = ychartCallstack(document.querySelector('#callstack'), {
  stackClick: (event: Event, data: any): void => {
    console.log(event, data);
  }, 
});

updateCallstack(callstackData);

const btnUpdateCallstack = document.querySelector('button#updateCallstackData');
btnUpdateCallstack.addEventListener('click', () => {
  callstackData.elapsedTime = 900;
  callstackData.children[0].elapsedTime = 500;

  updateCallstack(callstackData);
});
