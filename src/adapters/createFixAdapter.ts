import { TopoData, Node, Line } from '../../typings/defines';
import compose from '../compose';
import { NODE_TYPE, DATABASE_TYPE } from '../NODE_TYPE';

const createFixAdapter = (data: TopoData): TopoData => {
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

  return data;
};

export default compose<TopoData>(
  createFixAdapter,
);