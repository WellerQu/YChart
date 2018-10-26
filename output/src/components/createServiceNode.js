"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compose_1 = require("../compose");
var components_1 = require("./components");
var createServiceNode = function (option) { return function (parentNode) {
    var createNode = compose_1.default(components_1.createText({ content: option.title, x: 35 + 15, y: 90 + 24, className: 'title' }), components_1.createText({ content: option.epm + " epm", x: 82 + 15, y: 60 + 24, className: 'epm' }), components_1.createText({ content: option.rpm + " rpm", x: 82 + 15, y: 48 + 24, className: 'rpm' }), components_1.createText({ content: option.avgRT + " ms", x: 82 + 15, y: 36 + 24, className: 'avgRT' }), components_1.createText({ content: option.instances, x: 35 + 15, y: 37 + 24, className: 'instances' }), components_1.createText({ content: option.type, x: 0 + 15, y: 59 + 24, className: 'type' }), components_1.createCircle({ cx: 0 + 15, cy: 55 + 24, radius: 15, fill: '#338cff', className: 'type' }), components_1.createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 22, fill: 'white' }), components_1.createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 35, fill: option.color, className: 'health' }), components_1.createGroup);
    parentNode.children.push(createNode({ className: option.className, id: option.id }));
    return parentNode;
}; };
exports.default = createServiceNode;
