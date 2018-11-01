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

const topoData: TopoData = {'nodes':[{'id':'823014587906535424','name':'pass_serv','times':100490,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':3.02,'rpm':25.99,'epm':0,'health':'HEALTHY','totalCount':100545,'errorTotalCount':18,'crossApp':false,},{'id':'823014587906535424USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.message.sender.hualala.com:31722','name':'dohko.message.sender.hualala.com:31722','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.mis.service.im.hualala.com:31566','name':'dohko.mis.service.im.hualala.com:31566','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'172.16.32.103:6379','name':'172.16.32.103:6379','times':0,'type':'DATABASE','smallType':'redis','instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','name':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','times':0,'type':'DATABASE','smallType':'mysql','instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'823014138803544064','name':'serv_oa','times':89204,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':19.06,'rpm':26.38,'epm':0.01,'health':'HEALTHY','totalCount':89204,'errorTotalCount':23,'crossApp':false,},{'id':'823014138803544064USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.mis.service.personnel.hualala.com:31553','name':'dohko.mis.service.personnel.hualala.com:31553','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'823014285895675904','name':'serv_sales','times':19584,'type':'SERVER','smallType':null,'instances':2,'activeInstances':2,'elapsedTime':52.88,'rpm':6.77,'epm':0,'health':'NORMAL','totalCount':19597,'errorTotalCount':14,'crossApp':false,},{'id':'823014285895675904USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.auth.mis.tiaofangzi.com:31506','name':'dohko.auth.mis.tiaofangzi.com:31506','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.settle.service.hualala.com:31507','name':'dohko.settle.service.hualala.com:31507','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.supplychain.report.hualala.com:31715','name':'dohko.supplychain.report.hualala.com:31715','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'823014423024250880','name':'pass_login','times':61804,'type':'SERVER','smallType':null,'instances':2,'activeInstances':2,'elapsedTime':6.14,'rpm':38.45,'epm':0.06,'health':'HEALTHY','totalCount':61824,'errorTotalCount':93,'crossApp':false,},{'id':'823014423024250880USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.service.passport.internal.tiaofangzi.com:31501','name':'dohko.service.passport.internal.tiaofangzi.com:31501','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'823013549157789696','name':'api_web','times':33249,'type':'SERVER','smallType':null,'instances':3,'activeInstances':3,'elapsedTime':141.8,'rpm':12.93,'epm':0.03,'health':'NORMAL','totalCount':33278,'errorTotalCount':87,'crossApp':false,},{'id':'823013549157789696USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.sales.mis.tiaofangzi.com:31511','name':'dohko.sales.mis.tiaofangzi.com:31511','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.setting.pay.channel.hualala.com:31714','name':'dohko.setting.pay.channel.hualala.com:31714','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.product.x.hualala.com:31727','name':'dohko.product.x.hualala.com:31727','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.user.x.hualala.com:31729','name':'dohko.user.x.hualala.com:31729','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.thirdparty.x.hualala.com:31728','name':'dohko.thirdparty.x.hualala.com:31728','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.order.x.hualala.com:31726','name':'dohko.order.x.hualala.com:31726','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.basic.mis.tiaofangzi.com:31505','name':'dohko.basic.mis.tiaofangzi.com:31505','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.service.tax.hualala.com:31517','name':'dohko.service.tax.hualala.com:31517','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.backgroud.x.hualala.com:31724','name':'dohko.backgroud.x.hualala.com:31724','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.settle.channel.service.hualala.com:31746','name':'dohko.settle.channel.service.hualala.com:31746','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'http://hualala.service.gozap.com/gozap-service-portal-1.0.1/service/image','name':'http://hualala.service.gozap.com/gozap-service-portal-1.0.1/service/image','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.es.order.service.hualala.com:31606','name':'dohko.es.order.service.hualala.com:31606','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.kowledgebase.mis.tiaofangzi.com:31644','name':'dohko.kowledgebase.mis.tiaofangzi.com:31644','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.shop.pos.service.hualala.com:31574','name':'dohko.shop.pos.service.hualala.com:31574','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.shop.service.hualala.com:31503','name':'dohko.shop.service.hualala.com:31503','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.order.service.hualala.com:31515','name':'dohko.order.service.hualala.com:31515','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.service.shopcenter.hualala.com:6564','name':'dohko.service.shopcenter.hualala.com:6564','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.evaluate.x.hualala.com:31725','name':'dohko.evaluate.x.hualala.com:31725','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.service.short.message.hualala.com:31524','name':'dohko.service.short.message.hualala.com:31524','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.data.statistical.query.hualala.com:31799','name':'dohko.data.statistical.query.hualala.com:31799','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'823013791276097536','name':'serv_basic','times':7699,'type':'SERVER','smallType':null,'instances':3,'activeInstances':3,'elapsedTime':75.29,'rpm':3.01,'epm':0,'health':'NORMAL','totalCount':7706,'errorTotalCount':0,'crossApp':false,},{'id':'823013791276097536USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.module.auth.mis.tiaofangzi.com:31617','name':'dohko.module.auth.mis.tiaofangzi.com:31617','times':0,'type':'RPC','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'dohko.api.laobantong.hualala.com:80','name':'dohko.api.laobantong.hualala.com:80','times':0,'type':'HTTP','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'823013233861484544','name':'mis_api','times':6231,'type':'SERVER','smallType':null,'instances':2,'activeInstances':2,'elapsedTime':328.73,'rpm':9.74,'epm':0.03,'health':'NORMAL','totalCount':6231,'errorTotalCount':17,'crossApp':false,},{'id':'823013233861484544USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'api06.aliyun.venuscn.com:80','name':'api06.aliyun.venuscn.com:80','times':0,'type':'HTTP','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'823013853318242304','name':'serv_check','times':849,'type':'SERVER','smallType':null,'instances':2,'activeInstances':2,'elapsedTime':67.91,'rpm':2.71,'epm':0,'health':'NORMAL','totalCount':849,'errorTotalCount':0,'crossApp':false,},{'id':'823013853318242304USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true','name':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true','times':0,'type':'DATABASE','smallType':'mysql','instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'823013988502745088','name':'serv_im','times':1585,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':260.96,'rpm':1.97,'epm':0,'health':'NORMAL','totalCount':1585,'errorTotalCount':0,'crossApp':false,},{'id':'823013988502745088USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'api.netease.im:443','name':'api.netease.im:443','times':0,'type':'HTTP','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'823013689220292608','name':'api_web_na','times':4466,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':3.45,'rpm':1,'epm':0,'health':'HEALTHY','totalCount':4466,'errorTotalCount':0,'crossApp':false,},{'id':'823013689220292608USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'823014238059638784','name':'serv_pers','times':10,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':2123.5,'rpm':5,'epm':0,'health':'INTOLERANCE','totalCount':10,'errorTotalCount':0,'crossApp':false,},{'id':'823013923728023552','name':'serv_cserv','times':1,'type':'SERVER','smallType':null,'instances':1,'activeInstances':1,'elapsedTime':8677,'rpm':1,'epm':0,'health':'INTOLERANCE','totalCount':1,'errorTotalCount':0,'crossApp':false,},{'id':'823013923728023552USER','name':'用户','times':0,'type':'USER','smallType':null,'instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},{'id':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_cservice?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','name':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_cservice?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','times':0,'type':'DATABASE','smallType':'mysql','instances':0,'activeInstances':0,'elapsedTime':0,'rpm':0,'epm':0,'health':null,'totalCount':0,'errorTotalCount':0,'crossApp':false,},],'links':[{'source':'823014587906535424USER','target':'823014587906535424','elapsedTime':3.11,'rpm':0,},{'source':'823014587906535424','target':'823013988502745088','elapsedTime':0.19,'rpm':0,},{'source':'823014587906535424','target':'dohko.message.sender.hualala.com:31722','elapsedTime':0.44,'rpm':0,},{'source':'823014587906535424','target':'dohko.mis.service.im.hualala.com:31566','elapsedTime':0,'rpm':0,},{'source':'823014587906535424','target':'172.16.32.103:6379','elapsedTime':0.01,'rpm':0,},{'source':'823014587906535424','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':4.35,'rpm':0,},{'source':'823014138803544064USER','target':'823014138803544064','elapsedTime':23.45,'rpm':0,},{'source':'823014138803544064','target':'823013988502745088','elapsedTime':0.5,'rpm':0,},{'source':'823014138803544064','target':'823014238059638784','elapsedTime':0.2,'rpm':0,},{'source':'823014138803544064','target':'823014587906535424','elapsedTime':0,'rpm':0,},{'source':'823014138803544064','target':'dohko.mis.service.personnel.hualala.com:31553','elapsedTime':0.25,'rpm':0,},{'source':'823014138803544064','target':'dohko.mis.service.im.hualala.com:31566','elapsedTime':26,'rpm':0,},{'source':'823014138803544064','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':2.95,'rpm':0,},{'source':'823014138803544064','target':'172.16.32.103:6379','elapsedTime':0.15,'rpm':0,},{'source':'823014285895675904USER','target':'823014285895675904','elapsedTime':183.75,'rpm':0,},{'source':'823014285895675904','target':'823014138803544064','elapsedTime':0.04,'rpm':0,},{'source':'823014285895675904','target':'823013988502745088','elapsedTime':0.17,'rpm':0,},{'source':'823014285895675904','target':'dohko.auth.mis.tiaofangzi.com:31506','elapsedTime':0.05,'rpm':0,},{'source':'823014285895675904','target':'dohko.settle.service.hualala.com:31507','elapsedTime':0.08,'rpm':0,},{'source':'823014285895675904','target':'dohko.mis.service.im.hualala.com:31566','elapsedTime':0.25,'rpm':0,},{'source':'823014285895675904','target':'dohko.supplychain.report.hualala.com:31715','elapsedTime':0,'rpm':0,},{'source':'823014285895675904','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':15.27,'rpm':0,},{'source':'823014423024250880USER','target':'823014423024250880','elapsedTime':6.28,'rpm':0,},{'source':'823014423024250880','target':'823014587906535424','elapsedTime':0.06,'rpm':0,},{'source':'823014423024250880','target':'dohko.service.passport.internal.tiaofangzi.com:31501','elapsedTime':0.05,'rpm':0,},{'source':'823014423024250880','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':6.32,'rpm':0,},{'source':'823014423024250880','target':'172.16.32.103:6379','elapsedTime':0.1,'rpm':0,},{'source':'823013549157789696USER','target':'823013549157789696','elapsedTime':142.26,'rpm':0,},{'source':'823013549157789696','target':'823014587906535424','elapsedTime':0.05,'rpm':0,},{'source':'823013549157789696','target':'823014285895675904','elapsedTime':0.03,'rpm':0,},{'source':'823013549157789696','target':'823013791276097536','elapsedTime':0.03,'rpm':0,},{'source':'823013549157789696','target':'823014138803544064','elapsedTime':0.04,'rpm':0,},{'source':'823013549157789696','target':'823013988502745088','elapsedTime':0.08,'rpm':0,},{'source':'823013549157789696','target':'823013853318242304','elapsedTime':0.03,'rpm':0,},{'source':'823013549157789696','target':'823014423024250880','elapsedTime':0,'rpm':0,},{'source':'823013549157789696','target':'dohko.service.passport.internal.tiaofangzi.com:31501','elapsedTime':0.06,'rpm':0,},{'source':'823013549157789696','target':'dohko.sales.mis.tiaofangzi.com:31511','elapsedTime':0.04,'rpm':0,},{'source':'823013549157789696','target':'dohko.setting.pay.channel.hualala.com:31714','elapsedTime':0.05,'rpm':0,},{'source':'823013549157789696','target':'dohko.auth.mis.tiaofangzi.com:31506','elapsedTime':0.02,'rpm':0,},{'source':'823013549157789696','target':'dohko.product.x.hualala.com:31727','elapsedTime':0.05,'rpm':0,},{'source':'823013549157789696','target':'dohko.user.x.hualala.com:31729','elapsedTime':0.06,'rpm':0,},{'source':'823013549157789696','target':'dohko.thirdparty.x.hualala.com:31728','elapsedTime':0.02,'rpm':0,},{'source':'823013549157789696','target':'dohko.order.x.hualala.com:31726','elapsedTime':0.08,'rpm':0,},{'source':'823013549157789696','target':'dohko.settle.service.hualala.com:31507','elapsedTime':0.11,'rpm':0,},{'source':'823013549157789696','target':'dohko.basic.mis.tiaofangzi.com:31505','elapsedTime':0.07,'rpm':0,},{'source':'823013549157789696','target':'dohko.service.tax.hualala.com:31517','elapsedTime':0.09,'rpm':0,},{'source':'823013549157789696','target':'dohko.backgroud.x.hualala.com:31724','elapsedTime':0.09,'rpm':0,},{'source':'823013549157789696','target':'dohko.settle.channel.service.hualala.com:31746','elapsedTime':0.06,'rpm':0,},{'source':'823013549157789696','target':'http://hualala.service.gozap.com/gozap-service-portal-1.0.1/service/image','elapsedTime':275.22,'rpm':0,},{'source':'823013549157789696','target':'dohko.es.order.service.hualala.com:31606','elapsedTime':0.08,'rpm':0,},{'source':'823013549157789696','target':'dohko.kowledgebase.mis.tiaofangzi.com:31644','elapsedTime':0.11,'rpm':0,},{'source':'823013549157789696','target':'dohko.shop.pos.service.hualala.com:31574','elapsedTime':0,'rpm':0,},{'source':'823013549157789696','target':'dohko.shop.service.hualala.com:31503','elapsedTime':0.4,'rpm':0,},{'source':'823013549157789696','target':'dohko.order.service.hualala.com:31515','elapsedTime':0,'rpm':0,},{'source':'823013549157789696','target':'dohko.service.shopcenter.hualala.com:6564','elapsedTime':0,'rpm':0,},{'source':'823013549157789696','target':'dohko.evaluate.x.hualala.com:31725','elapsedTime':0,'rpm':0,},{'source':'823013549157789696','target':'dohko.service.short.message.hualala.com:31524','elapsedTime':0,'rpm':0,},{'source':'823013549157789696','target':'dohko.data.statistical.query.hualala.com:31799','elapsedTime':0,'rpm':0,},{'source':'823013549157789696','target':'dohko.mis.service.im.hualala.com:31566','elapsedTime':0,'rpm':0,},{'source':'823013549157789696','target':'172.16.32.103:6379','elapsedTime':0.01,'rpm':0,},{'source':'823013549157789696','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':1.23,'rpm':0,},{'source':'823013791276097536USER','target':'823013791276097536','elapsedTime':252.28,'rpm':0,},{'source':'823013791276097536','target':'823014138803544064','elapsedTime':0.05,'rpm':0,},{'source':'823013791276097536','target':'823013988502745088','elapsedTime':0,'rpm':0,},{'source':'823013791276097536','target':'dohko.auth.mis.tiaofangzi.com:31506','elapsedTime':0.04,'rpm':0,},{'source':'823013791276097536','target':'dohko.shop.service.hualala.com:31503','elapsedTime':0.13,'rpm':0,},{'source':'823013791276097536','target':'dohko.settle.channel.service.hualala.com:31746','elapsedTime':0.16,'rpm':0,},{'source':'823013791276097536','target':'dohko.settle.service.hualala.com:31507','elapsedTime':1.03,'rpm':0,},{'source':'823013791276097536','target':'dohko.module.auth.mis.tiaofangzi.com:31617','elapsedTime':0,'rpm':0,},{'source':'823013791276097536','target':'dohko.mis.service.im.hualala.com:31566','elapsedTime':0,'rpm':0,},{'source':'823013791276097536','target':'dohko.api.laobantong.hualala.com:80','elapsedTime':52,'rpm':0,},{'source':'823013791276097536','target':'dohko.message.sender.hualala.com:31722','elapsedTime':0,'rpm':0,},{'source':'823013791276097536','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':28.86,'rpm':0,},{'source':'823013233861484544USER','target':'823013233861484544','elapsedTime':332.47,'rpm':0,},{'source':'823013233861484544','target':'823014587906535424','elapsedTime':0.09,'rpm':0,},{'source':'823013233861484544','target':'823013791276097536','elapsedTime':0.07,'rpm':0,},{'source':'823013233861484544','target':'823014285895675904','elapsedTime':0.08,'rpm':0,},{'source':'823013233861484544','target':'823013988502745088','elapsedTime':0.05,'rpm':0,},{'source':'823013233861484544','target':'823014138803544064','elapsedTime':0.05,'rpm':0,},{'source':'823013233861484544','target':'823014423024250880','elapsedTime':0.03,'rpm':0,},{'source':'823013233861484544','target':'823013853318242304','elapsedTime':0.06,'rpm':0,},{'source':'823013233861484544','target':'dohko.service.passport.internal.tiaofangzi.com:31501','elapsedTime':0.1,'rpm':0,},{'source':'823013233861484544','target':'dohko.sales.mis.tiaofangzi.com:31511','elapsedTime':0.05,'rpm':0,},{'source':'823013233861484544','target':'dohko.auth.mis.tiaofangzi.com:31506','elapsedTime':0.07,'rpm':0,},{'source':'823013233861484544','target':'dohko.settle.service.hualala.com:31507','elapsedTime':0.2,'rpm':0,},{'source':'823013233861484544','target':'dohko.basic.mis.tiaofangzi.com:31505','elapsedTime':0.07,'rpm':0,},{'source':'823013233861484544','target':'dohko.mis.service.im.hualala.com:31566','elapsedTime':0,'rpm':0,},{'source':'823013233861484544','target':'dohko.settle.channel.service.hualala.com:31746','elapsedTime':0.6,'rpm':0,},{'source':'823013233861484544','target':'api06.aliyun.venuscn.com:80','elapsedTime':4681,'rpm':0,},{'source':'823013233861484544','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':6.29,'rpm':0,},{'source':'823013853318242304USER','target':'823013853318242304','elapsedTime':209.52,'rpm':0,},{'source':'823013853318242304','target':'823014138803544064','elapsedTime':0.13,'rpm':0,},{'source':'823013853318242304','target':'823013988502745088','elapsedTime':0.1,'rpm':0,},{'source':'823013853318242304','target':'dohko.auth.mis.tiaofangzi.com:31506','elapsedTime':0.16,'rpm':0,},{'source':'823013853318242304','target':'dohko.mis.service.im.hualala.com:31566','elapsedTime':1,'rpm':0,},{'source':'823013853318242304','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true','elapsedTime':9,'rpm':0,},{'source':'823013853318242304','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':30.49,'rpm':0,},{'source':'823013853318242304','target':'172.16.32.103:6379','elapsedTime':0,'rpm':0,},{'source':'823013988502745088USER','target':'823013988502745088','elapsedTime':302.98,'rpm':0,},{'source':'823013988502745088','target':'api.netease.im:443','elapsedTime':82.63,'rpm':0,},{'source':'823013988502745088','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':1.14,'rpm':0,},{'source':'823013689220292608USER','target':'823013689220292608','elapsedTime':3.49,'rpm':0,},{'source':'823013689220292608','target':'823013791276097536','elapsedTime':74,'rpm':0,},{'source':'823014238059638784','target':'http://hualala.service.gozap.com/gozap-service-portal-1.0.1/service/image','elapsedTime':80.91,'rpm':0,},{'source':'823013923728023552USER','target':'823013923728023552','elapsedTime':8805,'rpm':0,},{'source':'823013923728023552','target':'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_cservice?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor','elapsedTime':128,'rpm':0,},],};

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