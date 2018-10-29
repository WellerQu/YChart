"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
// limit range
var widthClamp = utils_1.clamp(320, 2420);
var heightClamp = utils_1.clamp(160, 1210);
var handleMousewheel = function (event) {
    var svgElement = event.target;
    while (svgElement.nodeName.toUpperCase() !== 'SVG') {
        svgElement = svgElement.parentElement;
    }
    var viewBox = svgElement.getAttribute('viewBox');
    var _a = utils_1.parseViewBoxValue(viewBox), x = _a[0], y = _a[1], width = _a[2], height = _a[3];
    var diffWidth = 20;
    var diffHeight = diffWidth * height / width;
    if (event.deltaY > 0) {
        // to bigger
        var newWidth = widthClamp(width - diffWidth);
        var newHeight = heightClamp(height - diffHeight);
        var newX = newWidth * x / width;
        var newY = newHeight * y / height;
        svgElement.setAttribute('viewBox', utils_1.toViewBox(newX, newY, newWidth, newHeight));
    }
    else if (event.deltaY < 0) {
        // to smaller
        var newWidth = widthClamp(width + diffWidth);
        var newHeight = heightClamp(height + diffHeight);
        var newX = newWidth * x / width;
        var newY = newHeight * y / height;
        svgElement.setAttribute('viewBox', utils_1.toViewBox(newX, newY, newWidth, newHeight));
    }
    return event;
};
var setupMousewheel = utils_1.setupEventHandler(utils_1.throttle(handleMousewheel, 20))('mousewheel');
// Scale stage
exports.scaleCanvas = function (stage) { return function (next) { return function (userState) {
    var root = stage.getStageNode();
    setupMousewheel(root);
    // 视域左上角定位元素 
    // 开发模式开启协助开发
    // root.children.push(
    //  h('rect', { attrs:{ x: 0, y: 0, width: 10, height: 10, fill: 'red'}, ns: 'http://www.w3.org/2000/svg',})
    // );
    next(userState);
}; }; };
