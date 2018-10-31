import { TopoData, Node, Line, } from '../../typings/defines';
import compose from '../compose';
import { NODE_TYPE, DATABASE_TYPE, } from '../NODE_TYPE';

const createFixAdapter = (data: TopoData): TopoData => {
  // 补齐缺省的字段值
  data.nodes = data.nodes.map((node: Node) => {

    node.showName = node.showName || node.name;
    node.showIcon = node.smallType || node.type;

    if (node.type === NODE_TYPE.DATABASE) {
      if (node.smallType === DATABASE_TYPE.KAFKA_CONSUMER || node.smallType === DATABASE_TYPE.KAFKA_PRODUCER) {
        node.showIcon = 'kafka';
      }     
      if (node.smallType === DATABASE_TYPE.MYSQL) {
        node.showName = 'mysql';
      }
    } 

    const linkSelfLines = data.links.filter((line: Line) => line.source === node.id && line.target === node.id);
    if (linkSelfLines.length > 0)
      node.showIcon = `${node.showIcon}_loop`;
    return node;
  });

  // 去掉没有对应节点的连线
  const nodeIDs = data.nodes.map((node: Node) => node.id);
  data.links = data.links.filter((line: Line) => {
    return ~nodeIDs.findIndex(n => n === line.source) && ~nodeIDs.findIndex(n => n === line.target);
  });

  return data;
};

export default compose<TopoData>(
  createFixAdapter,
);