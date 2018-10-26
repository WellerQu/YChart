"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var compose_1 = require("../compose");
var components_1 = require("./components");
var IMAGE_SIZE = 50;
var createImageNode = function (option) { return function (parentNode) {
    var title = option.title, URL = option.URL, className = option.className, id = option.id;
    var createNode = compose_1.default(components_1.createText({
        content: title,
        x: constants_1.NODE_SIZE / 2,
        y: (constants_1.NODE_SIZE - IMAGE_SIZE) / 2 + IMAGE_SIZE + 20,
        className: 'title',
    }), components_1.createImage({
        URL: URL,
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        x: (constants_1.NODE_SIZE - IMAGE_SIZE) / 2,
        y: (constants_1.NODE_SIZE - IMAGE_SIZE) / 2,
    }), components_1.createGroup);
    parentNode.children.push(createNode({ className: className, id: id }));
    return parentNode;
}; };
exports.default = createImageNode;
