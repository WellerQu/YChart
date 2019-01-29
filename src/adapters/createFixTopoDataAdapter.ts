/**
 * @module adapters
 */

import { TopoData, Node, Line, Params, } from '../@types';
import compose from '../compose';
import { NODE_TYPE, DATABASE_TYPE, } from '../constants/constants';

/**
 * 对TopoData实例进行修复
 * @memberof adapters
 * @param data TopoData实例
 * @returns
 */
function fixAdapter (data: TopoData): TopoData {
  // 补齐缺省的字段值
  data.nodes = data.nodes.map((node: Node) => {
    // 防御性判断
    // node.health = node.health || HEALTH.HEALTHY;
    node.type = node.type || NODE_TYPE.SERVER;
    node.showName = node.showName || node.name;
    node.showIcon = node.smallType || node.type;

    // 特殊图标处理, 有时间应该纯SVG来绘制
    if (node.type === NODE_TYPE.DATABASE) {
      if (node.smallType === DATABASE_TYPE.KAFKA_CONSUMER || node.smallType === DATABASE_TYPE.KAFKA_PRODUCER) {
        node.showIcon = 'kafka';
      }     
    } 

    // 处理自连接连线
    const firstLine = data.links.find((line: Line) => line.source === node.id && line.target === node.id);
    if (firstLine) 
      node.showIcon = `${node.showIcon}_loop`;

    return node;
  });

  // 去掉没有对应节点的连线
  // 去掉自连接的连线
  const nodeIDs = data.nodes.map((node: Node) => node.id);
  data.links = data.links.filter((line: Line) => {
    return ~nodeIDs.findIndex(n => n === line.source) && ~nodeIDs.findIndex(n => n === line.target);
  }).filter((line: Line) => {
    return line.source !== line.target;
  });

  return data;
};

/**
 * 修复mysql数据库节点信息, 解析连接字符串, 并将解析结果放置在mysqldatabase字段中
 * @param data TopoData实例
 * @returns
 */
function fixDatabases (data: TopoData): TopoData {
  const nodes: Node[] = data.nodes.filter(
    (item: Node) => item.smallType === DATABASE_TYPE.MYSQL
  );

  // step 0, look at the example
  // jdbc:mysql://mysql.third_party_order.master.hualala.com:6330/db_third_party_order?useUnicode=true
  //
  // now, we split this string to much parts like this:
  //
  // jdbc:mysql://(domain)
  // port
  // instance
  // params(&?key=value)
  //
  // so, our step 0 is that make a regexp(/^jdbc:mysql:\/\/([^:]+):(\d+)\/([^?]+)\??(.*)$/ig) for extracting value that
  // include domain, port, url(instance), params
  nodes.forEach((n: Node) => {
    n.showName = 'mysql';

    const regexpOfMain = /^jdbc:mysql:\/\/([^:]+):(\d+)(?:\/([^?]+))?\??(.*)$/gi;
    if (!regexpOfMain.test(n.id)) {
      return;
    }

    const protocol = 'jdbc:mysql';
    const domain = RegExp.$1;
    const port = +RegExp.$2;
    const url = RegExp.$3;

    const paramString = RegExp.$4;
    const params: Params[] = [];
    const regexOfParams = /&?(?:([^=]+)=([^&]*))/gi;
    const maxLoop = 50; // to make sure that the next while loop is not DEAD LOOP absolutely
    let result = null,
      counter = 0;

    // parse paramString to paramObject
    while ((result = regexOfParams.exec(paramString))) {
      if (counter++ > maxLoop) break;

      params.push({
        name: result[1],
        value: result[2],
      });
    }

    n.mysqlDatabases = {
      origin: n.id,
      protocol,
      domain,
      port,
      url,
      params,
    };
  });

  return data;
}; 

export default compose<TopoData>(
  fixAdapter,
  fixDatabases,
);