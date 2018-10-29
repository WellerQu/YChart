"use strict";
/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var compose_1 = require("../compose");
var NODE_TYPE_1 = require("../NODE_TYPE");
var constants_1 = require("../constants");
var findGroup = function (event) {
    var element = event.target;
    if (!element.nodeName)
        return null;
    while (element.nodeName.toUpperCase() !== 'G' && element.nodeName.toUpperCase() !== 'SVG') {
        element = element.parentElement;
    }
    if (!element.classList.contains(NODE_TYPE_1.NODE_TYPE.NODE))
        return null;
    return element;
};
var parsePathD = function (value) {
    var regExp = /M(-?\d+(?:.\d+)?),\s*(-?\d+(?:.\d+)?)\s*L(-?\d+(?:.\d+)?),\s*(-?\d+(?:.\d+)?)/igm;
    if (!regExp.test(value))
        throw new Error("can NOT convert to path d: " + value);
    return [
        [+RegExp.$1, +RegExp.$2],
        [+RegExp.$3, +RegExp.$4],
    ];
};
// const updateArrowPosition = (arrow: SVGPathElement) => (x1: number, y1: number, x2: number, y2: number) =>
exports.moveNode = function (stage) { return function (next) { return function (userState) {
    console.log('DOING: moveNode'); // eslint-disable-line
    var root = stage.getStageNode();
    var isMouseDown = false;
    var sourcePosition = { x: 0, y: 0 };
    var targetPosition = { x: 0, y: 0 };
    var targetElement = null;
    var handleMouseDown = function (event) {
        targetElement = findGroup(event);
        if (!targetElement)
            return event;
        isMouseDown = true;
        sourcePosition.x = event.pageX;
        sourcePosition.y = event.pageY;
        var position = utils_1.parseTranslate(targetElement.style.transform);
        targetPosition.x = position.x;
        targetPosition.y = position.y;
        return event;
    };
    var handleMouseMove = function (event) {
        if (!isMouseDown)
            return event;
        var svgElement = event.target;
        while (svgElement.nodeName.toUpperCase() !== 'SVG') {
            svgElement = svgElement.parentElement;
        }
        if (targetElement) {
            // re-compute the node position
            var diffX = event.pageX - sourcePosition.x;
            var diffY = event.pageY - sourcePosition.y;
            var _a = utils_1.parseViewBoxValue(svgElement.getAttribute('viewBox')), width = _a[2];
            var containerWidth = svgElement.parentElement.offsetWidth;
            var ratio = (width / containerWidth);
            var newX_1 = targetPosition.x + diffX * ratio;
            var newY_1 = targetPosition.y + diffY * ratio;
            targetElement.style.transform = utils_1.toTranslate(newX_1, newY_1);
            // re-draw those line-related
            var currentElementID_1 = targetElement.id;
            Array.from(targetElement.parentElement.children)
                .filter(function (item) {
                if (!item.classList.contains(NODE_TYPE_1.NODE_TYPE.LINE))
                    return false;
                var _a = item.id.split('-'), source = _a[0], target = _a.slice(1);
                return source === currentElementID_1 || target.join('-') === currentElementID_1;
            })
                .forEach(function (item) {
                var _a = item.id.split('-'), source = _a[0], target = _a.slice(1);
                var paths = item.querySelectorAll('path');
                var line = paths[0];
                var arrow = paths[1];
                var text = item.querySelector('text.line-desc');
                var _b = parsePathD(line.getAttribute('d')), _c = _b[0], x1 = _c[0], y1 = _c[1], _d = _b[1], x2 = _d[0], y2 = _d[1];
                var x = constants_1.NODE_SIZE / 2 + newX_1;
                var y = constants_1.NODE_SIZE / 2 + newY_1;
                var startX, startY, endX, endY;
                if (source === currentElementID_1) {
                    // update start position
                    startX = x;
                    startY = y;
                    endX = x2;
                    endY = y2;
                    line.setAttribute('d', "M" + x + "," + y + " L" + x2 + "," + y2);
                }
                else if (target.join('-') === currentElementID_1) {
                    // update end position
                    startX = x1;
                    startY = y1;
                    endX = x;
                    endY = y;
                    arrow.setAttribute('d', utils_1.toArrowD(x1, y1));
                    line.setAttribute('d', "M" + x1 + "," + y1 + " L" + x + "," + y);
                }
                if (startX) {
                    // update arrow
                    var lA = endY - startY;
                    var lB = endX - startX;
                    var lC = Math.sqrt(Math.pow(lA, 2) + Math.pow(lB, 2));
                    var lc = constants_1.ARROW_OFFSET;
                    var la = lc * lA / lC;
                    var lb = lc * lB / lC;
                    var arrowX = lb + startX;
                    var arrowY = la + startY;
                    arrow.setAttribute('d', utils_1.toArrowD(arrowX, arrowY));
                    // atan2使用的坐标系0度在3点钟方向, rotate使用的坐标系0度在12点钟方向, 相差90度
                    var a = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI + 90; // 阿尔法a
                    arrow.setAttribute('transform', "rotate(" + a + ", " + arrowX + " " + arrowY + ")");
                    // update text
                    text.setAttribute('x', (endX - startX) / 2 + startX);
                    text.setAttribute('y', (endY - startY) / 2 + startY);
                }
            });
        }
        return event;
    };
    var handleMouseUp = function (event) {
        isMouseDown = false;
        targetElement = null;
        return event;
    };
    var setupDragMoveNodeHandler = compose_1.default(utils_1.setupEventHandler(handleMouseDown)('mousedown'), utils_1.setupEventHandler(handleMouseMove)('mousemove'), utils_1.setupEventHandler(handleMouseUp)('mouseup'));
    setupDragMoveNodeHandler(root);
    next(userState);
}; }; };
