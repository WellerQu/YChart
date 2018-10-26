"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compose_1 = require("../compose");
var createFixAdapter = function (data) {
    data.nodes = data.nodes.map(function (node) {
        node.showName = node.showName || node.name;
        node.showIcon = node.smallType || node.type;
        var linkSelfLines = data.links.filter(function (line) { return line.source === node.id && line.target === node.id; });
        if (linkSelfLines.length > 0)
            node.showIcon = node.showIcon + "_loop";
        return node;
    });
    return data;
};
exports.default = compose_1.default(createFixAdapter);
