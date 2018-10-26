"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
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
    var offsetX = event.clientX - svgElement.parentElement.offsetLeft;
    var offsetY = event.clientY - svgElement.parentElement.offsetTop;
    var initializeWidth = svgElement.parentElement.offsetWidth;
    var initializeHeight = svgElement.parentElement.offsetHeight;
    if (event.deltaY > 0) {
        var newWidth = widthClamp(width - diffWidth);
        var newHeight = heightClamp(height - diffHeight);
        var newOffsetX = newWidth * offsetX / initializeWidth;
        var newOffsetY = newHeight * offsetY / initializeHeight;
        var newX = newWidth * x / width;
        var newY = newHeight * y / height;
        svgElement.setAttribute('viewBox', utils_1.toViewBox(newX, newY, newWidth, newHeight));
    }
    else if (event.deltaY < 0) {
        var newWidth = widthClamp(width + diffWidth);
        var newHeight = heightClamp(height + diffHeight);
        var newX = newWidth * x / width;
        var newY = newHeight * y / height;
        var newOffsetX = newWidth * offsetX / initializeWidth;
        var newOffsetY = newHeight * offsetY / initializeHeight;
        svgElement.setAttribute('viewBox', utils_1.toViewBox(newX, newY, newWidth, newHeight));
    }
    return event;
};
var setupMousewheel = utils_1.setupEventHandler(utils_1.throttle(handleMousewheel, 20))('mousewheel');
exports.scaleCanvas = function (stage) { return function (next) { return function (userState) {
    var root = stage.getStageNode();
    setupMousewheel(root);
    next(userState);
}; }; };
