"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var HEALTH_1 = require("../HEALTH");
var NODE_TYPE_1 = require("../NODE_TYPE");
var HEALTH_COLOR = (_a = {},
    _a[HEALTH_1.HEALTH.HEALTHY] = '#a9d86e',
    _a[HEALTH_1.HEALTH.NORMAL] = '#86cae4',
    _a[HEALTH_1.HEALTH.INTOLERANCE] = '#f58210',
    _a);
function createServiceNodeOption(node) {
    return {
        title: node.showName,
        instances: node.activeInstances + "/" + node.instances,
        color: HEALTH_COLOR[node.health],
        className: node.type + " " + NODE_TYPE_1.NODE_TYPE.NODE,
        type: node.type,
        avgRT: node.elapsedTime,
        rpm: node.rpm,
        epm: node.epm,
        id: node.id,
    };
}
exports.default = createServiceNodeOption;
