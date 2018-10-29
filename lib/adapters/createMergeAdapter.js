"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NODE_TYPE_1 = require("../NODE_TYPE");
var compose_1 = require("../compose");
var mergeUsers = function (data) {
    var othersNodes = data.nodes.filter(function (item) { return item.type !== NODE_TYPE_1.NODE_TYPE.USER; });
    var nodes = data.nodes.filter(function (item) { return item.type === NODE_TYPE_1.NODE_TYPE.USER; });
    var othersLines = data.links.filter(function (item) { return nodes.every(function (node) { return node.id !== item.source; }); });
    var lines = data.links.filter(function (item) { return nodes.some(function (node) { return node.id === item.source; }); });
    var head = nodes[0], tails = nodes.slice(1);
    var mergedNodes = head ? [head] : [];
    lines.filter(function (item) { return tails.some(function (node) { return node.id === item.source; }); })
        .forEach(function (item) { return (item.source = head.id, item); });
    data.nodes = othersNodes.concat(mergedNodes);
    data.links = othersLines.concat(lines);
    return data;
};
var mergeHTTPOrRPC = function (data) {
    var othersNodes = data.nodes.filter(function (item) {
        return item.type !== NODE_TYPE_1.NODE_TYPE.HTTP && item.type !== NODE_TYPE_1.NODE_TYPE.RPC;
    });
    var nodes = data.nodes.filter(function (item) {
        return item.type === NODE_TYPE_1.NODE_TYPE.HTTP || item.type === NODE_TYPE_1.NODE_TYPE.RPC;
    });
    var othersLines = data.links.filter(function (item) {
        return nodes.every(function (node) { return node.id !== item.target; });
    });
    var lines = data.links.filter(function (item) {
        return nodes.some(function (node) { return node.id === item.target; });
    });
    var mergedNodeMap = new Map();
    var mergedLines = [];
    nodes.forEach(function (node) {
        var relatedLines = lines.filter(function (line) { return line.target === node.id; });
        var relatedLineSources = relatedLines.map(function (line) { return line.source; });
        var key = node.type + "_" + relatedLineSources.join('_');
        if (key === node.type + "_")
            return;
        if (!mergedNodeMap.has(key)) {
            mergedNodeMap.set(key, []);
            mergedLines.splice.apply(mergedLines, [0, 0].concat(relatedLines));
        }
        mergedNodeMap.get(key).push(node);
        mergedNodeMap.get(key)[0].showName = "remote (" + mergedNodeMap.get(key).length * relatedLineSources.length + ")";
        if (!mergedNodeMap.get(key)[0].tiers) {
            mergedNodeMap.get(key)[0].tiers = relatedLines.map(function (line) {
                var tier = othersNodes.find(function (n) { return n.id === line.source; });
                return {
                    tierName: tier.name,
                    name: node.name,
                    elapsedTime: line.elapsedTime,
                };
            });
        }
    });
    var mergedNodes = Array.from(mergedNodeMap.values())
        .filter(function (nodes) { return nodes.length > 0; })
        .map(function (nodes) { return nodes[0]; });
    data.nodes = othersNodes.concat(mergedNodes);
    data.links = othersLines.concat(mergedLines);
    return data;
};
exports.default = compose_1.default(mergeUsers, mergeHTTPOrRPC);
