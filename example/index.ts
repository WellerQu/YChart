import ychartTopo from '../src/ychart-topo';
import ychartCallstack from '../src/ychart-callstack';
import { TopoData, CallstackData, Line, Node, } from '../typings/defines';

const eventOption = {
  'nodeClick': (event: Event, data: ( Node|Line )): void => { console.log(event, data) },
  // 'lineClick': (event: MouseEvent, data: Line): void => { console.log(event, data); },
  // 'nodeMouseOver': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'nodeMouseOut': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'lineMouseOver': (event: MouseEvent, data: Line): void => { console.log(event, data); },
  // 'lineMouseOut': (event: MouseEvent, data: Node): void => { console.log(event, data); },
};

const updateTopo = ychartTopo(document.querySelector('#topo'), eventOption, (userState?: any) => {
  console.log('updated successfully', userState); // eslint-disable-line
}, true);

const topoData: TopoData = {'nodes':[{'id':'827634124553515008','name':'api_web','times':153341,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':12935.79,'rpm':929.34,'epm':0.02,'health':'INTOLERANCE','totalCount':153341,'errorTotalCount':3,'crossApp':false,},{'id':'827634124553515008USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.service.passport.internal.tiaofangzi.com/172.16.3.201:31501','name':'dohko.service.passport.internal.tiaofangzi.com/172.16.3.201:31501','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'localhost/127.0.0.1:6566','name':'localhost/127.0.0.1:6566','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'127.0.0.1:6566','name':'127.0.0.1:6566','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.service.passport.internal.tiaofangzi.com:31501','name':'dohko.service.passport.internal.tiaofangzi.com:31501','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'172.16.32.103:6379','name':'172.16.32.103:6379','times':0,'type':'DATABASE','smallType':'redis','instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','name':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','times':0,'type':'DATABASE','smallType':'mysql','instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'827634607468900352','name':'s_sales','times':9796,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':16864.39,'rpm':74.78,'epm':0.01,'health':'INTOLERANCE','totalCount':9796,'errorTotalCount':1,'crossApp':false,},{'id':'827634330607087616','name':'s_org_auth','times':97,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':101.07,'rpm':8.08,'epm':0,'health':'NORMAL','totalCount':97,'errorTotalCount':0,'crossApp':false,},{'id':'827634071068598272','name':'s_basic','times':34,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':68.85,'rpm':1.21,'epm':0,'health':'INTOLERANCE','totalCount':34,'errorTotalCount':0,'crossApp':false,},],'links':[{'source':'827634124553515008USER','target':'827634124553515008','elapsedTime':12935.89,'rpm':0,},{'source':'827634124553515008','target':'827634607468900352','elapsedTime':0.04,'rpm':0,},{'source':'827634124553515008','target':'827634071068598272','elapsedTime':0.06,'rpm':0,},{'source':'827634124553515008','target':'827634330607087616','elapsedTime':0.2,'rpm':0,},{'source':'827634124553515008','target':'dohko.service.passport.internal.tiaofangzi.com/172.16.3.201:31501','elapsedTime':0.06,'rpm':0,},{'source':'827634124553515008','target':'localhost/127.0.0.1:6566','elapsedTime':0.03,'rpm':0,},{'source':'827634124553515008','target':'127.0.0.1:6566','elapsedTime':0.47,'rpm':0,},{'source':'827634124553515008','target':'dohko.service.passport.internal.tiaofangzi.com:31501','elapsedTime':39,'rpm':0,},{'source':'827634124553515008','target':'172.16.32.103:6379','elapsedTime':0.01,'rpm':0,},{'source':'827634124553515008','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':11.59,'rpm':0,},{'source':'827634607468900352','target':'827634330607087616','elapsedTime':2.16,'rpm':0,},{'source':'827634607468900352','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':971.34,'rpm':0,},{'source':'827634330607087616','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':13.73,'rpm':0,},{'source':'827634330607087616','target':'172.16.32.103:6379','elapsedTime':0.4,'rpm':0,},{'source':'827634071068598272','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':270.83,'rpm':0,},],};

updateTopo(topoData);

const btnUpdate = document.querySelector('button#updateTopoData');
btnUpdate.addEventListener('click', () => {
  topoData.nodes[0].instances = Math.random() * 10 >> 0;
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