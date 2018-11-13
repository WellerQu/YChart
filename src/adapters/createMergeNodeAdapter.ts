import { TopoData, Node, Line, TierNode,  } from '../../typings/defines';
import { NODE_TYPE, } from '../NODE_TYPE';

import compose from '../compose';

/**
 * 合并TopoData实例中的Node实例集合, 将其中所有type标记为USER的Node实例合并成一个
 * @memberof Adapters
 * @param data TopoData实例
 * @returns 合并完后的TopoData实例
 */
const mergeUsers = (data: TopoData): TopoData => {
  const othersNodes: Node[] = data.nodes.filter((item: Node) => item.type !== NODE_TYPE.USER);
  const nodes: Node[] = data.nodes.filter((item: Node) => item.type === NODE_TYPE.USER);

  const othersLines: Line[] = data.links.filter((item: Line) => nodes.every((node: Node) => node.id !== item.source));
  const lines: Line[] = data.links.filter((item: Line) => nodes.some((node: Node) => node.id === item.source));

  const [ head, ...tails ] = nodes;

  const mergedNodes = head ? [head,] : [];
  lines.filter((item: Line) => tails.some((node: Node) => node.id === item.source))
    .forEach((item: Line) => (item.source = head.id, item));

  data.nodes = othersNodes.concat(mergedNodes);
  data.links = othersLines.concat(lines);

  return data;
};

/**
 * 合并TopoData实例中的Node实例集合, 将其中所有type标记为HTTP或者RPC的Node实例合并成一个, 此合并函数中存在一个
 * 合并策略, 请仔细阅读
 * @memberof Adapters
 * @param data TopoData实例
 * @returns 合并完后的TopoData实例
 */
const mergeHTTPOrRPC = (data: TopoData): TopoData => {
  const othersNodes: Node[] = data.nodes.filter((item: Node) => 
    item.type !== NODE_TYPE.HTTP && item.type !== NODE_TYPE.RPC);
  const nodes: Node[] = data.nodes.filter((item: Node) => 
    item.type === NODE_TYPE.HTTP || item.type === NODE_TYPE.RPC);

  const othersLines: Line[] = data.links.filter((item: Line) =>
    nodes.every((node: Node) => node.id !== item.target && node.id !== item.source)
  );
  const lines: Line[] = data.links.filter((item: Line) =>
    nodes.some((node: Node) => node.id === item.target || node.id === item.source)
  );

  const mergedNodeMap: Map<string, Node[]> = new Map<string, Node[]>();
  const mergedLines: Line[] = [];

  nodes.forEach((node: Node): void => {
    const relatedLines = lines.filter((line: Line) => line.target === node.id);
    const relatedLineSources = relatedLines.map((line: Line) => line.source);
    const key = `${node.type}_${relatedLineSources.join('_')}`;

    if (key === `${node.type}_`) return;

    if (!mergedNodeMap.has(key)) {
      mergedNodeMap.set(key, []);
      mergedLines.splice(0, 0, ...relatedLines);
    }

    mergedNodeMap.get(key).push(node); 
    mergedNodeMap.get(key)[0].showName = `remote (${mergedNodeMap.get(key).length * relatedLineSources.length})`;

    if (!mergedNodeMap.get(key)[0].tiers) 
      mergedNodeMap.get(key)[0].tiers = [];
 
    const tiers = mergedNodeMap.get(key)[0].tiers;
    mergedNodeMap.get(key)[0].tiers = tiers.concat(
      relatedLines.filter((line: Line) => othersNodes.find((n: Node) => n.id === line.source))
        .map<TierNode>((line: Line) => {
        const tier = othersNodes.find((n: Node) => n.id === line.source);
        return {
          tierName: tier.name,
          name: node.name,
          elapsedTime: line.elapsedTime,
        };
      }));
  });

  const mergedNodes: Node[] = Array.from(mergedNodeMap.values())
    .filter((nodes: Node[]) => nodes.length > 0)
    .map<Node>((nodes: Node[]) => nodes[0]);

  data.nodes = othersNodes.concat(mergedNodes);
  data.links = othersLines.concat(mergedLines);

  return data;
};

export default compose<TopoData>(
  mergeUsers,
  mergeHTTPOrRPC,
);
