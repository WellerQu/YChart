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
});

const topoData: TopoData = {'nodes':[{'id':'824483456579997696','name':'gw_tier','times':1985,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':21.41,'rpm':66.07,'epm':0,'health':'HEALTHY','totalCount':1850,'errorTotalCount':0,'crossApp':false,},{'id':'824483456579997696USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'etcd://172.16.3.204:8081/dohko/shop-document-query','name':'etcd://172.16.3.204:8081/dohko/shop-document-query','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'etcd://172.16.3.204:8081/dohko/order-service','name':'etcd://172.16.3.204:8081/dohko/order-service','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'etcd://172.16.3.204:8081/dohko/pos-service','name':'etcd://172.16.3.204:8081/dohko/pos-service','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'etcd://172.16.3.204:8081/dohko/shop-crm-service-21','name':'etcd://172.16.3.204:8081/dohko/shop-crm-service-21','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'etcd://172.16.3.204:8081/dohko/shop-base-service','name':'etcd://172.16.3.204:8081/dohko/shop-base-service','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'jieqianhua-host4:8081','name':'jieqianhua-host4:8081','times':0,'type':'HTTP','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'etcd://172.16.3.204:8081/dohko/shop-business-service','name':'etcd://172.16.3.204:8081/dohko/shop-business-service','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'etcd://172.16.3.204:8081/dohko/device-manage','name':'etcd://172.16.3.204:8081/dohko/device-manage','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'etcd://172.16.3.204:8081/dohko/promotion-service-21','name':'etcd://172.16.3.204:8081/dohko/promotion-service-21','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'etcd://172.16.3.204:8081/dohko/shop-fast-query','name':'etcd://172.16.3.204:8081/dohko/shop-fast-query','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'etcd://172.16.3.204:8081/dohko/trd-shop-params-service','name':'etcd://172.16.3.204:8081/dohko/trd-shop-params-service','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},],'links':[{'source':'824483456579997696USER','target':'824483456579997696','elapsedTime':21.41,'rpm':0,},{'source':'824483456579997696','target':'etcd://172.16.3.204:8081/dohko/shop-document-query','elapsedTime':1.16,'rpm':0,},{'source':'824483456579997696','target':'etcd://172.16.3.204:8081/dohko/order-service','elapsedTime':254.1,'rpm':0,},{'source':'824483456579997696','target':'etcd://172.16.3.204:8081/dohko/pos-service','elapsedTime':1.6,'rpm':0,},{'source':'824483456579997696','target':'etcd://172.16.3.204:8081/dohko/shop-crm-service-21','elapsedTime':250.65,'rpm':0,},{'source':'824483456579997696','target':'etcd://172.16.3.204:8081/dohko/shop-base-service','elapsedTime':0.77,'rpm':0,},{'source':'824483456579997696','target':'jieqianhua-host4:8081','elapsedTime':1.2,'rpm':0,},{'source':'824483456579997696','target':'etcd://172.16.3.204:8081/dohko/shop-business-service','elapsedTime':1.5,'rpm':0,},{'source':'824483456579997696','target':'etcd://172.16.3.204:8081/dohko/device-manage','elapsedTime':2.5,'rpm':0,},{'source':'824483456579997696','target':'etcd://172.16.3.204:8081/dohko/promotion-service-21','elapsedTime':4.2,'rpm':0,},{'source':'824483456579997696','target':'etcd://172.16.3.204:8081/dohko/shop-fast-query','elapsedTime':10,'rpm':0,},{'source':'824483456579997696','target':'etcd://172.16.3.204:8081/dohko/trd-shop-params-service','elapsedTime':10,'rpm':0,},],};

updateTopo(topoData);

const btnUpdate = document.querySelector('button#updateTopoData');
btnUpdate.addEventListener('click', () => {
  topoData.nodes[0].instances = Math.random() * 10 >> 0;
  updateTopo(topoData);
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