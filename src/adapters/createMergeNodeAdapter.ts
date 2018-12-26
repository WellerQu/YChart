/**
 * @module adapters
 */

import { TopoData, Node, Line, TierNode, Params,  } from '../../typings/defines';
import compose from '../compose';
import { NODE_TYPE, DATABASE_TYPE, } from '../constants/constants';

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

/**
 * 合并TopoData实例中的Node实例集合, 将其中所有type标记为DATABASE并用来表示mysql的Node实例合并成一个,
 * 此合并函数中存在一个合并策略, 请仔细阅读源代码
 * @param data 
 * @returns 合并完后的TopoData实例
 */
export const mergeDatabases = (data: TopoData): TopoData => {
  const othersNodes: Node[] = data.nodes.filter((item: Node) => 
    item.smallType !== DATABASE_TYPE.MYSQL
  );
  const nodes: Node[] = data.nodes.filter((item: Node) => 
    item.smallType === DATABASE_TYPE.MYSQL
  );

  const othersLines: Line[] = data.links.filter((item: Line) => nodes.every((node: Node) => node.id !== item.target));
  const lines: Line[] = data.links.filter((item: Line) => nodes.some((node: Node) => node.id === item.target));

  const mergedNodeMap = new Map<string, Node[]>(); 
  const mergedLines: Line[] = [];

  // step 0, look at the example
  // jdbc:mysql://mysql.third_party_order.master.hualala.com:6330/db_third_party_order?useUnicode=true&characterEncoding=utf8&autoReconnectForPools=true&statementInterceptors=brave.mysql.TracingStatementInterceptor&socketTimeout=60000
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
    const regexpOfMain = /^jdbc:mysql:\/\/([^:]+):(\d+)\/([^?]+)\??(.*)$/ig;
    if (!regexpOfMain.test(n.id)) {
      return;
    }

    const relatedLines = lines.filter(l => l.target === n.id);
    const title = 'mysql';
    const protocol = 'jdbc:mysql://';
    const domain = RegExp.$1;
    const port = +RegExp.$2;
    const url = RegExp.$3;
    const tierName: string[] = othersNodes.filter(n => relatedLines.some(l => l.source === n.id)).map(n => n.name);

    const paramString = RegExp.$4;
    const params: Params<string> = {};
    const regexOfParams = /&?(?:([^=]+)=([^&]*))/ig;
    const maxLoop = 50; // to make sure that the next while loop is not DEAD LOOP absolutely
    let result = null, counter = 0;

    // parse paramString to paramObject
    while (result = regexOfParams.exec(paramString)) {
      if (counter++ > maxLoop)
        break;

      params[result[1]] = result[2];
    }

    // step 1
    // begin to merge, we initialize a map with a key that includes domain and instanceName
    // the point is that make domain and instance to be combined for be key
    const key = `${domain}/${url}`;

    if (!mergedNodeMap.has(key)) {
      // there's not group, so initialize group
      mergedNodeMap.set(key, []);
      n.mysqlDatabases = [{ title, origin: n.id, protocol, tierName, domain, port, url, params, },];
    } else {
      // change the target property of line, assign this first node.id to the target property
      relatedLines.forEach(l => l.target = mergedNodeMap.get(key)[0].id);
      // to collect merged database information
      mergedNodeMap.get(key)[0].mysqlDatabases.push({
        title,
        origin: n.id,
        protocol,
        tierName,
        domain,
        port,
        url,
        params,
      });
    }

    // the lines will be drawn on the graph
    mergedLines.splice(0, 0, ...relatedLines);

    mergedNodeMap.get(key).push(n);
  });

  // step 2, transform map to array
  const mergedNodes: Node[] = Array.from(mergedNodeMap.values()).map<Node>((nodes: Node[]) => {
    if (nodes.length > 1)
      nodes[0].showName = `mysql (${nodes.length})`;
    else
      nodes[0].showName = 'mysql';

    return nodes[0];
  });

  // step 3, assign value to root
  data.nodes = othersNodes.concat(mergedNodes);
  data.links = othersLines.concat(mergedLines);

  return data;
}; 

export default compose<TopoData>(
  mergeUsers,
  mergeHTTPOrRPC,
  mergeDatabases,
);
