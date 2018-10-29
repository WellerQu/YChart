"use strict";
/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var NODE_TYPE_1 = require("../NODE_TYPE");
var utils_1 = require("../utils");
var handleMouseEnter = function (event) {
    // target is SVGGElement
    var gElement = event.target;
    if (!gElement.querySelector)
        return event;
    var pathElement = gElement.querySelector('path');
    if (!pathElement.getAttribute)
        return event;
    var animateMotionElement = gElement.querySelector('animateMotion');
    if (!animateMotionElement.beginElement)
        return event;
    animateMotionElement.setAttribute('path', pathElement.getAttribute('d'));
    // animateMotionElement.beginElement();
    return event;
};
var handleMouseOut = function (event) {
    // target is SVGPathElement
    var pathElement = event.target;
    var animateMotionElement = pathElement.parentElement.querySelector('animateMotion');
    if (!animateMotionElement.endElement)
        return event;
    animateMotionElement.endElement();
    return event;
};
var setupMouseEnterHandler = utils_1.setupEventHandler(handleMouseEnter)('mouseenter');
var setupMouseOutHandler = utils_1.setupEventHandler(handleMouseOut)('mouseout');
// Example for middleware that show how to add an interaction
exports.interaction = function (stage) { return function (next) { return function (userState) {
    console.log('TODO: add interaction'); // eslint-disable-line
    var root = stage.getStageNode();
    var children = root.children;
    children.forEach(function (item) {
        var node = item;
        if (!node.data)
            return;
        if (!node.data.class[NODE_TYPE_1.NODE_TYPE.LINE])
            return;
        setupMouseEnterHandler(node);
        setupMouseOutHandler(node);
    });
    next(userState);
}; }; };
