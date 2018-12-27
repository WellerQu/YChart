/**
 * @module adapters
 */

import { TopoData, Node, Line, TierNode, } from '../../typings/defines';
import compose from '../compose';
import { NODE_TYPE, } from '../constants/constants';

/**
 * 合并TopoData实例中的Node实例集合, 将其中所有type标记为USER的Node实例合并成一个
 * @param data TopoData实例
 * @returns
 */
export const mergeUsers = (data: TopoData): TopoData => {
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
 * 合并TopoData实例中的Node实例集合, 将其中所有type标记为HTTP或者RPC的Node实例合并成一个,
 * 此合并函数中存在一个合并策略, 请仔细阅读源代码
 * @param data TopoData实例
 * @returns 合并完后的TopoData实例
 */
export const mergeHTTPOrRPC = (data: TopoData): TopoData => { 
  // 不需要处理的节点
  const othersNodes: Node[] = data.nodes.filter((item: Node) => 
    item.type !== NODE_TYPE.HTTP && item.type !== NODE_TYPE.RPC
  );
  // 需要处理的节点
  const nodes: Node[] = data.nodes.filter((item: Node) => 
    item.type === NODE_TYPE.HTTP || item.type === NODE_TYPE.RPC
  );

  // 与处理节点无关的线段
  const othersLines: Line[] = data.links.filter((item: Line) =>
    nodes.every((node: Node) => node.id !== item.target && node.id !== item.source)
  );
  // 与处理节点相关的线段
  const lines: Line[] = data.links.filter((item: Line) =>
    nodes.some((node: Node) => node.id === item.target || node.id === item.source)
  );

  const mergedNodeMap: Map<string, Node[]> = new Map<string, Node[]>();
  const mergedLines: Line[] = [];

  // 遍历所有相关的节点, *根据节点类型与指向此节点的来源节点的ID集合作为分组依据*
  nodes.forEach((node: Node): void => {
    const relatedLines = lines.filter((line: Line) => line.target === node.id);
    const relatedLineSources = relatedLines.map((line: Line) => line.source);
    const prefixOfKey = node.type;
    const key = `${prefixOfKey}_${relatedLineSources.join('_')}`;

    if (key === `${prefixOfKey}_`) return;

    if (!mergedNodeMap.has(key)) {
      // 仅保存与首个节点相关的线段, 其后线段均抛弃, 保存的线段会绘制在图上
      mergedNodeMap.set(key, []);
      mergedLines.splice(0, 0, ...relatedLines);
    }

    mergedNodeMap.get(key).push(node);
    mergedNodeMap.get(key)[0].showName = `remotes (${mergedNodeMap.get(key).length * relatedLineSources.length})`;

    if (!mergedNodeMap.get(key)[0].tiers) 
      mergedNodeMap.get(key)[0].tiers = [];
 
    // 将被合并的节点信息挂在代表此组的节点上
    const tiers = mergedNodeMap.get(key)[0].tiers;
    mergedNodeMap.get(key)[0].tiers = tiers.concat(
      relatedLines
        .filter((line: Line) => othersNodes.find((n: Node) => n.id === line.source))
        .map<TierNode>((line: Line) => {
          const tier = othersNodes.find((n: Node) => n.id === line.source);
          return {
            tierName: tier.name,
            name: node.name,
            elapsedTime: line.elapsedTime,
          };
        })
    );
  });

  const mergedNodes: Node[] = Array.from(mergedNodeMap.values())
    .filter((nodes: Node[]) => nodes.length > 0)
    .map<Node>((nodes: Node[]) => nodes[0]);

  // 重新组织需要绘制的节点和线段
  data.nodes = othersNodes.concat(mergedNodes);
  data.links = othersLines.concat(mergedLines);

  return data;
};

export default compose<TopoData>(
  mergeUsers,
  mergeHTTPOrRPC,
);
