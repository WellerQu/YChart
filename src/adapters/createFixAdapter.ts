import { TopoData, Node, Line, } from '../../typings/defines';
import compose from '../compose';

const createFixAdapter = (data: TopoData): TopoData => {
  data.nodes = data.nodes.map((node: Node) => {
    node.showName = node.showName || node.name;
    node.showIcon = node.smallType || node.type;

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