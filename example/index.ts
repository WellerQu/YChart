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
  id: '0',
  appName: 'cba',
  name: 'root stack service',
  totalTimeSpend: 6, // ms
  timeOffset: 0,
  fill: 'blue',
  children: [
    {
      id: '1',
      appName: 'abc',
      name: 'serv 0',
      totalTimeSpend: 1,
      timeOffset: 1,
      children: [
        {
          id: '11',
          appName: 'abc',
          name: 'serv 01',
          totalTimeSpend: 1,
          timeOffset: 2,
          children: [
            {
              id: '111',
              appName: 'abc 1',
              name: 'serv 001',
              totalTimeSpend: 1,
              timeOffset: 3,
            },
            {
              id: '112',
              appName: 'abc 1',
              name: 'serv 002',
              totalTimeSpend: 1,
              timeOffset: 3,
            }
          ],
        },
        {
          id: '12',
          appName: 'abc',
          name: 'serv 02',
          totalTimeSpend: 3,
          timeOffset: 2,
        },
      ],
    },
    {
      id: '2',
      appName: 'abc',
      name: 'serv 1',
      totalTimeSpend: 44,
      timeOffset: 4,
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
  callstackData.totalTimeSpend = 900;
  callstackData.children[0].totalTimeSpend = 500;

  updateCallstack(callstackData);
});
