"use strict";
/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var compose_1 = require("../compose");
var components_1 = require("./components");
var createArrowLine = function (option) { return function (parentNode) {
    var createNode = compose_1.default(components_1.createText({
        content: option.text || '',
        className: 'line-desc',
        x: 0,
        y: 0,
    }), components_1.createArrow({
        x: 0,
        y: 0,
        id: option.id,
        fill: option.fill
    }), components_1.createLine({
        id: option.id,
        x1: option.x1,
        y1: option.y1,
        x2: option.x2,
        y2: option.y2,
        strokeColor: option.strokeColor,
        strokeWidth: option.strokeWidth
    }), components_1.createGroup);
    parentNode.children.push(createNode({ className: option.className, id: option.id }));
    return parentNode;
}; };
exports.default = createArrowLine;
