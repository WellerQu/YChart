"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NODE_TYPE_1 = require("../NODE_TYPE");
var utils_1 = require("../utils");
function createImageNodeOption(node) {
    return {
        URL: utils_1.imagePath(node.showIcon.toLowerCase()),
        title: node.showName,
        className: node.type + " " + NODE_TYPE_1.NODE_TYPE.NODE,
        id: node.id,
    };
}
exports.default = createImageNodeOption;
