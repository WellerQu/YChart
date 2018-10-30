import ychartTopo from '../src/ychart-topo';
import ychartCallstack from '../src/ychart-callstack';
import { TopoData, CallstackData } from '../typings/defines';

const eventOption = {
  // 'nodeClick': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'lineClick': (event: MouseEvent, data: Line): void => { console.log(event, data); },
  // 'nodeMouseOver': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'nodeMouseOut': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'lineMouseOver': (event: MouseEvent, data: Line): void => { console.log(event, data); },
  // 'lineMouseOut': (event: MouseEvent, data: Node): void => { console.log(event, data); },
};

const updateTopo = ychartTopo(document.querySelector('#topo'), eventOption, (userState?: any) => {
  console.log('updated successfully', userState); // eslint-disable-line
});

const topoData: TopoData = {
  'nodes':[  
    {  
      'id':'821931823954018304',
      'name':'website',
      'times':1363,
      'type':'SERVER',
      'smallType':null,
      'instances':2,
      'activeInstances':2,
      'elapsedTime':43.46,
      'rpm': undefined,
      'epm': undefined,
      'health': null,
      'totalCount':1363,
      'errorTotalCount':149,
      'error': 123,
      'crossApp':false,
      'apdex':'SLOW',
      'callCount': 1,
    },
    {  
      'id':'821931823954018304USER',
      'name':'用户',
      'times':0,
      'type':'USER',
      'smallType':null,
      'instances':0,
      'activeInstances':0,
      'elapsedTime':0,
      'rpm': undefined,
      'epm': undefined,
      'health':null,
      'totalCount':0,
      'errorTotalCount':0,
      'error': null,
      'crossApp':false,
      'apdex':'SLOW',
      'callCount': 1,
    },
    {  
      'id':'jdbc:mysql://172.16.32.98:3306/kepler_management?\
useUnicode=true&characterEncoding=utf-8&useSSL=false&autoCommit=true',
      'name':'jdbc:mysql://172.16.32.98:3306/kepler_management?\
useUnicode=true&characterEncoding=utf-8&useSSL=false&autoCommit=true',
      'times':0,
      'type':'DATABASE',
      'smallType':'mysql',
      'instances':0,
      'activeInstances':0,
      'elapsedTime':0,
      'rpm':0,
      'epm':0,
      'health':null,
      'totalCount':0,
      'errorTotalCount':0,
      'error': null,
      'crossApp':false,
      'apdex':'ERROR',
      'callCount': 1,
    },
  ],
  'links':[  
    {  
      'source':'821931823954018304USER',
      'target':'821931823954018304',
      'elapsedTime':44.53,
      'rpm':0,
    },
    {  
      'source':'821931823954018304',
      'target':'jdbc:mysql://172.16.32.98:3306/kepler_management?\
useUnicode=true&characterEncoding=utf-8&useSSL=false&autoCommit=true',
      'elapsedTime':1,
      'rpm':0,
    },
  ],
};

updateTopo(topoData);

const btnUpdate = document.querySelector('button#update');
btnUpdate.addEventListener('click', () => {
  topoData.nodes[0].instances = Math.random() * 10 >> 0;
  updateTopo(topoData);
});

const callstackData: CallstackData = {
  stackName: 'root stack service',
  duration: 8000, // ms
  children: [
    {
      stackName: 'serv 0',
      duration: 300,
      children: [
        {
          stackName: 'serv 01',
          duration: 240,
        },
        {
          stackName: 'serv 02',
          duration: 300,
        },
      ],
    },
    {
      stackName: 'serv 1',
      duration: 8000,
    },
  ],
};

const updateCallstack = ychartCallstack(document.querySelector('#callstack'));

updateCallstack(callstackData);