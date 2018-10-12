import { TopoData, Node, Line, } from '../../typings/defines';

import compose from '../compose';

enum NodeType {
  USER = 'USER',
  SERVER = 'SERVER ',
  DATABASE = 'DATABASE',
  NOSQL = 'NOSQL',
  HTTP = 'HTTP',
  RPC = 'RPC',
  MQ = 'MQ'
};

const mergeUsers = (data: TopoData): TopoData => {
  const othersNodes: Node[] = data.nodes.filter((item: Node) => item.type !== NodeType.USER);
  const nodes: Node[] = data.nodes.filter((item: Node) => item.type === NodeType.USER);

  const othersLines: Line[] = data.links.filter((item: Line) => nodes.every((node: Node) => node.id !== item.source));
  const lines: Line[] = data.links.filter((item: Line) => nodes.some((node: Node) => node.id === item.source));

  const [ head, ...tails ] = nodes;

  const mergedNodes = [head];
  lines.filter((item: Line) => tails.some((node: Node) => node.id === item.source))
    .forEach((item: Line) => (item.source = head.id, item));

  data.nodes = othersNodes.concat(mergedNodes);
  data.links = othersLines.concat(lines);

  // console.log(data.nodes, data.links);

  return data;
};

const mergeHTTPOrRPC = (data: TopoData): TopoData => {
  const othersNodes: Node[] = data.nodes.filter((item: Node) => item.type !== NodeType.HTTP && item.type !== NodeType.RPC);
  const nodes: Node[] = data.nodes.filter((item: Node) => item.type === NodeType.HTTP || item.type === NodeType.RPC);

  const othersLines: Line[] = data.links.filter((item: Line) => nodes.every((node: Node) => node.id !== item.target));
  const lines: Line[] = data.links.filter((item: Line) => nodes.some((node: Node) => node.id === item.target));

  const mergedNodeMap: Map<string, Node[]> = new Map<string, Node[]>();
  const mergedLines: Line[] = [];

  nodes.forEach((node: Node): void => {
    const relatedLines = lines.filter((line: Line) => line.target === node.id);
    const relatedLineSources = relatedLines.map((line: Line) => line.source);
    const key = `${node.type}_${relatedLineSources.join('_')}`;

    if (key === `${node.type}_`)
      return;

    if (!mergedNodeMap.has(key)) {
      mergedNodeMap.set(key, []);
      mergedLines.splice(0, 0, ...relatedLines);
    }

    mergedNodeMap.get(key).push(node);
    mergedNodeMap.get(key)[0].showName = `remote (${mergedNodeMap.get(key).length * relatedLineSources.length})`;
  });

  const mergedNodes: Node[] = Array.from(mergedNodeMap.values())
    .filter((nodes: Node[]) => nodes.length > 0)
    .map<Node>((nodes: Node[]) => nodes[0]);

  data.nodes = othersNodes.concat(mergedNodes);
  data.links = othersLines.concat(mergedLines);

  // console.log(data.nodes, data.links);

  return data;
};

export default compose<TopoData>(
  (data: TopoData) => (console.log(data), data),
  mergeUsers,
  mergeHTTPOrRPC,
  (data: TopoData) => (console.log(data), data),
);
