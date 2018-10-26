"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var compose_1 = require("../compose");
exports.moveCanvas = function (stage) { return function (next) { return function (userState) {
    var root = stage.getStageNode();
    var isMouseDown = false;
    var sourcePosition = { x: 0, y: 0 };
    var targetPosition = { x: 0, y: 0 };
    var startViewBox = '';
    var handleMouseDown = function (event) {
        var target = event.target;
        if (target.nodeName.toUpperCase() !== 'SVG')
            return event;
        isMouseDown = true;
        sourcePosition.x = event.pageX;
        sourcePosition.y = event.pageY;
        startViewBox = target.getAttribute('viewBox');
        target.style.cursor = 'move';
        return event;
    };
    var handleMouseMove = function (event) {
        if (!isMouseDown)
            return event;
        var target = event.target;
        if (target.nodeName.toUpperCase() !== 'SVG') {
            return event;
        }
        targetPosition.x = event.pageX;
        targetPosition.y = event.pageY;
        var diffX = targetPosition.x - sourcePosition.x;
        var diffY = targetPosition.y - sourcePosition.y;
        var svgElement = event.target;
        while (svgElement.nodeName.toUpperCase() !== 'SVG') {
            svgElement = svgElement.parentElement;
        }
        var _a = utils_1.parseViewBoxValue(startViewBox), x1 = _a[0], y1 = _a[1];
        var _b = utils_1.parseViewBoxValue(svgElement.getAttribute('viewBox')), width = _b[2], height = _b[3];
        var containerWidth = svgElement.parentElement.offsetWidth;
        var ratio = -(width / containerWidth);
        var newX = x1 + (diffX * ratio);
        var newY = y1 + (diffY * ratio);
        svgElement.setAttribute('viewBox', newX + ", " + newY + ", " + width + ", " + height);
        return event;
    };
    var handleMouseUp = function (event) {
        isMouseDown = false;
        var svgElement = event.target;
        while (svgElement.nodeName.toUpperCase() !== 'SVG') {
            svgElement = svgElement.parentElement;
        }
        svgElement.style.cursor = 'default';
        startViewBox = svgElement.getAttribute('viewBox');
        return event;
    };
    var setupDragMoveHandler = compose_1.default(utils_1.setupEventHandler(handleMouseDown)('mousedown'), utils_1.setupEventHandler(handleMouseMove)('mousemove'), utils_1.setupEventHandler(handleMouseUp)('mouseup'));
    setupDragMoveHandler(root);
    next(userState);
}; }; };
