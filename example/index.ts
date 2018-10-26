import render from '../src/topo';
import { TopoData, } from '../typings/defines';

const eventOption = {
  // 'nodeClick': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'lineClick': (event: MouseEvent, data: Line): void => { console.log(event, data); },
  // 'nodeMouseOver': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'nodeMouseOut': (event: MouseEvent, data: Node): void => { console.log(event, data); },
  // 'lineMouseOver': (event: MouseEvent, data: Line): void => { console.log(event, data); },
  // 'lineMouseOut': (event: MouseEvent, data: Node): void => { console.log(event, data); },
};

const update = render(document.querySelector('#app'), eventOption, (userState?: any) => {
  console.log('updated successfully', userState);
});

const data: TopoData = {
  'nodes': [
    {
      'id': '819416579131514880',
      'name': 'api_web',
      'times': 711,
      'type': 'SERVER',
      'smallType': null,
      'instances': 1,
      'activeInstances': 1,
      'elapsedTime': 209.23,
      'rpm': 11.66,
      'epm': 0.03,
      'health': 'NORMAL',
      'totalCount': 711,
      'errorTotalCount': 2,
      'crossApp': false
    },
    {
      'id': '819416579131514880USER',
      'name': '用户',
      'times': 0,
      'type': 'USER',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.service.passport.internal.tiaofangzi.com:31501',
      'name': 'dohko.service.passport.internal.tiaofangzi.com:31501',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '127.0.0.1:6564',
      'name': '127.0.0.1:6564',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '127.0.0.1:6566',
      'name': '127.0.0.1:6566',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.thirdparty.x.hualala.com:31728',
      'name': 'dohko.thirdparty.x.hualala.com:31728',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '127.0.0.1:6565',
      'name': '127.0.0.1:6565',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.product.x.hualala.com:31727',
      'name': 'dohko.product.x.hualala.com:31727',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.user.x.hualala.com:31729',
      'name': 'dohko.user.x.hualala.com:31729',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.service.tax.hualala.com:31517',
      'name': 'dohko.service.tax.hualala.com:31517',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.shop.service.hualala.com:31503',
      'name': 'dohko.shop.service.hualala.com:31503',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.setting.pay.channel.hualala.com:31714',
      'name': 'dohko.setting.pay.channel.hualala.com:31714',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.es.order.service.hualala.com:31606',
      'name': 'dohko.es.order.service.hualala.com:31606',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.evaluate.x.hualala.com:31725',
      'name': 'dohko.evaluate.x.hualala.com:31725',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.monitor.service.hualala.com:31575',
      'name': 'dohko.monitor.service.hualala.com:31575',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.service.shopcenter.hualala.com:6564',
      'name': 'dohko.service.shopcenter.hualala.com:6564',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.service.short.message.hualala.com:31524',
      'name': 'dohko.service.short.message.hualala.com:31524',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'dohko.shop.pos.service.hualala.com:31574',
      'name': 'dohko.shop.pos.service.hualala.com:31574',
      'times': 0,
      'type': 'RPC',
      'smallType': null,
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '172.16.32.103:6379',
      'name': '172.16.32.103:6379',
      'times': 0,
      'type': 'DATABASE',
      'smallType': 'redis',
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor',
      'name': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor',
      'times': 0,
      'type': 'DATABASE',
      'smallType': 'mysql',
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '819417623475257344',
      'name': '销售系统',
      'times': 191,
      'type': 'SERVER',
      'smallType': null,
      'instances': 1,
      'activeInstances': 1,
      'elapsedTime': 33.85,
      'rpm': 4.55,
      'epm': 0,
      'health': 'NORMAL',
      'totalCount': 191,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '819416511313813504',
      'name': 's_basic',
      'times': 73,
      'type': 'SERVER',
      'smallType': null,
      'instances': 1,
      'activeInstances': 1,
      'elapsedTime': -452.78,
      'rpm': 1.97,
      'epm': 0.03,
      'health': 'NORMAL',
      'totalCount': 73,
      'errorTotalCount': 1,
      'crossApp': false
    },
    {
      'id': '819417323083603968',
      'name': 's_org_auth',
      'times': 316,
      'type': 'SERVER',
      'smallType': null,
      'instances': 1,
      'activeInstances': 1,
      'elapsedTime': 42.91,
      'rpm': 8.32,
      'epm': 0,
      'health': 'HEALTHY',
      'totalCount': 316,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '819417089154686976',
      'name': 's_schoolbg',
      'times': 1,
      'type': 'SERVER',
      'smallType': null,
      'instances': 1,
      'activeInstances': 1,
      'elapsedTime': 255,
      'rpm': 1,
      'epm': 0,
      'health': 'NORMAL',
      'totalCount': 1,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '819416427348041728',
      'name': 's_check',
      'times': 2,
      'type': 'SERVER',
      'smallType': null,
      'instances': 1,
      'activeInstances': 1,
      'elapsedTime': 103,
      'rpm': 1,
      'epm': 0,
      'health': 'NORMAL',
      'totalCount': 2,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true',
      'name': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true',
      'times': 0,
      'type': 'DATABASE',
      'smallType': 'mysql',
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': '819417506865422336',
      'name': 's_cserv',
      'times': 1,
      'type': 'SERVER',
      'smallType': null,
      'instances': 1,
      'activeInstances': 1,
      'elapsedTime': 60,
      'rpm': 1,
      'epm': 0,
      'health': 'HEALTHY',
      'totalCount': 1,
      'errorTotalCount': 0,
      'crossApp': false
    },
    {
      'id': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_cservice?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor',
      'name': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_cservice?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor',
      'times': 0,
      'type': 'DATABASE',
      'smallType': 'mysql',
      'instances': 0,
      'activeInstances': 0,
      'elapsedTime': 0,
      'rpm': 0,
      'epm': 0,
      'health': null,
      'totalCount': 0,
      'errorTotalCount': 0,
      'crossApp': false
    }
  ],
  'links': [
    {
      'source': '819416579131514880USER',
      'target': '819416579131514880',
      'elapsedTime': 209.58,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': '819417623475257344',
      'elapsedTime': 0.14,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': '819416511313813504',
      'elapsedTime': 0.07,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': '819417323083603968',
      'elapsedTime': 0.14,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': '819416427348041728',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': '819417089154686976',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': '819417506865422336',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.service.passport.internal.tiaofangzi.com:31501',
      'elapsedTime': 0.12,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': '127.0.0.1:6564',
      'elapsedTime': 0.1,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': '127.0.0.1:6566',
      'elapsedTime': 0.05,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.thirdparty.x.hualala.com:31728',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': '127.0.0.1:6565',
      'elapsedTime': 0.33,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.product.x.hualala.com:31727',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.user.x.hualala.com:31729',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.service.tax.hualala.com:31517',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.shop.service.hualala.com:31503',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.setting.pay.channel.hualala.com:31714',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.es.order.service.hualala.com:31606',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.evaluate.x.hualala.com:31725',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.monitor.service.hualala.com:31575',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.service.shopcenter.hualala.com:6564',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.service.short.message.hualala.com:31524',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'dohko.shop.pos.service.hualala.com:31574',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': '172.16.32.103:6379',
      'elapsedTime': 0.04,
      'rpm': 0
    },
    {
      'source': '819416579131514880',
      'target': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor',
      'elapsedTime': 1.77,
      'rpm': 0
    },
    {
      'source': '819417623475257344',
      'target': '819417323083603968',
      'elapsedTime': 0.24,
      'rpm': 0
    },
    {
      'source': '819417623475257344',
      'target': '127.0.0.1:6565',
      'elapsedTime': 0,
      'rpm': 0
    },
    {
      'source': '819417623475257344',
      'target': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor',
      'elapsedTime': 28.19,
      'rpm': 0
    },
    {
      'source': '819416511313813504',
      'target': '819417323083603968',
      'elapsedTime': 0.5,
      'rpm': 0
    },
    {
      'source': '819416511313813504',
      'target': '127.0.0.1:6565',
      'elapsedTime': 0.5,
      'rpm': 0
    },
    {
      'source': '819416511313813504',
      'target': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor',
      'elapsedTime': 27.41,
      'rpm': 0
    },
    {
      'source': '819417323083603968',
      'target': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor',
      'elapsedTime': 3.92,
      'rpm': 0
    },
    {
      'source': '819417323083603968',
      'target': '172.16.32.103:6379',
      'elapsedTime': 0.18,
      'rpm': 0
    },
    {
      'source': '819417089154686976',
      'target': '819417323083603968',
      'elapsedTime': 0.4,
      'rpm': 0
    },
    {
      'source': '819417089154686976',
      'target': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor',
      'elapsedTime': 2,
      'rpm': 0
    },
    {
      'source': '819416427348041728',
      'target': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_mis?useUnicode=true',
      'elapsedTime': 132,
      'rpm': 0
    },
    {
      'source': '819417506865422336',
      'target': 'jdbc:mysql://dohko.mysql.001.master.hualala.com:3306/db_cservice?useUnicode=true&statementInterceptors=brave.mysql.TracingStatementInterceptor',
      'elapsedTime': 4,
      'rpm': 0
    }
  ]
};

update(data);