import ychartTopo from '../src/ychart-topo';
import ychartCallstack from '../src/ychart-callstack';
import { TopoData, CallstackData, } from '../typings/defines';

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

const topoData: TopoData = {'nodes':[{'id':'823014587906535424','name':'pass_serv','times':2432,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':2.22,'rpm':40.72,'epm':0.02,'health':'HEALTHY','totalCount':2362,'errorTotalCount':1,'crossApp':false,},{'id':'823014587906535424USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.message.sender.hualala.com:31722','name':'dohko.message.sender.hualala.com:31722','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'172.16.32.103:6379','name':'172.16.32.103:6379','times':0,'type':'DATABASE','smallType':'redis','instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','name':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','times':0,'type':'DATABASE','smallType':'mysql','instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},],'links':[{'source':'823014587906535424USER','target':'823014587906535424','elapsedTime':2.3,'rpm':0,},{'source':'823014587906535424','target':'823013988502745088','elapsedTime':0.14,'rpm':0,},{'source':'823014587906535424','target':'dohko.message.sender.hualala.com:31722','elapsedTime':0,'rpm':0,},{'source':'823014587906535424','target':'172.16.32.103:6379','elapsedTime':0.01,'rpm':0,},{'source':'823014587906535424','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':3.14,'rpm':0,},],};

updateTopo(topoData);

const btnUpdate = document.querySelector('button#updateTopoData');
btnUpdate.addEventListener('click', () => {
  topoData.nodes[0].instances = Math.random() * 10 >> 0;
  updateTopo(topoData);
});

const callstackData: CallstackData = {
  stackName: 'root stack service',
  duration: 800, // ms
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