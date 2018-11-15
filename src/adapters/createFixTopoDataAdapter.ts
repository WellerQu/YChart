/**
 * @module adapters
 */

import { TopoData, Node, Line, } from '../../typings/defines';
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
      if (node.smallType === DATABASE_TYPE.MYSQL) {
        node.showName = 'mysql';
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

export default compose<TopoData>(
  fixAdapter,
);