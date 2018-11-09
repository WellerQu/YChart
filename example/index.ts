import ychartTopo from '../src/ychart-topo';
import ychartCallstack from '../src/ychart-callstack';
import { TopoData, CallstackData, Line, Node, } from '../typings/defines';
import json from './topo.json';

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
  (userState?: any) => {
    console.log("updated successfully", userState); // eslint-disable-line
  },
  false
);

const topoData: TopoData = json.data;

updateTopo(topoData);

const btnUpdate = document.querySelector('button#updateTopoData');
btnUpdate.addEventListener('click', () => {
  topoData.nodes[0].instances = (Math.random() * 10) >> 0;
  updateTopo(topoData, { x: 0, y: 0, width: 800, height: 600, });
});

const callstackData: CallstackData = {
  stackName: 'root stack service',
  duration: 2260, // ms
  offsetTime: 0,
  children: [
    {
      stackName: 'serv 0',
      duration: 300,
      offsetTime: 100,
      children: [
        {
          stackName: 'serv 01',
          duration: 100,
          offsetTime: 100,
          children: [
            {
              stackName: 'serv 001',
              duration: 10,
              offsetTime: 100,
            },
          ],
        },
        {
          stackName: 'serv 02',
          duration: 3,
          offsetTime: 100,
        },
      ],
    },
    {
      stackName: 'serv 1',
      duration: 700,
      offsetTime: 100,
    },
  ],
};

const updateCallstack = ychartCallstack(document.querySelector('#callstack'));

updateCallstack(callstackData);

const btnUpdateCallstack = document.querySelector('button#updateCallstackData');
btnUpdateCallstack.addEventListener('click', () => {
  callstackData.duration = 900;
  callstackData.children[0].duration = 500;

  updateCallstack(callstackData);
});
