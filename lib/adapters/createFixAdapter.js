"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compose_1 = require("../compose");
var NODE_TYPE_1 = require("../NODE_TYPE");
var createFixAdapter = function (data) {
    data.nodes = data.nodes.map(function (node) {
        node.showName = node.showName || node.name;
        node.showIcon = node.smallType || node.type;
        if (node.type === NODE_TYPE_1.NODE_TYPE.DATABASE) {
            if (node.smallType === NODE_TYPE_1.DATABASE_TYPE.KAFKA_CONSUMER || node.smallType === NODE_TYPE_1.DATABASE_TYPE.KAFKA_PRODUCER) {
                node.showIcon = 'kafka';
            }
            if (node.smallType === NODE_TYPE_1.DATABASE_TYPE.MYSQL) {
                node.showName = 'mysql';
            }
        }
        var linkSelfLines = data.links.filter(function (line) { return line.source === node.id && line.target === node.id; });
        if (linkSelfLines.length > 0)
            node.showIcon = node.showIcon + "_loop";
        return node;
    });
    return data;
};
exports.default = compose_1.default(createFixAdapter);
