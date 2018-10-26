"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NODE_TYPE_1 = require("../NODE_TYPE");
function createImageNodeOption(node) {
    return {
        URL: node.showIcon.toLowerCase() + ".png",
        title: node.showName,
        className: node.type + " " + NODE_TYPE_1.NODE_TYPE.NODE,
        id: node.id,
    };
}
exports.default = createImageNodeOption;
