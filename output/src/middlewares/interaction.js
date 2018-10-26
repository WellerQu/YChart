"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NODE_TYPE_1 = require("../NODE_TYPE");
var utils_1 = require("../utils");
var handleMouseEnter = function (event) {
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
    return event;
};
var handleMouseOut = function (event) {
    var pathElement = event.target;
    var animateMotionElement = pathElement.parentElement.querySelector('animateMotion');
    if (!animateMotionElement.endElement)
        return event;
    animateMotionElement.endElement();
    return event;
};
var setupMouseEnter = utils_1.setupEventHandler(handleMouseEnter)('mouseenter');
var setupMouseOut = utils_1.setupEventHandler(handleMouseOut)('mouseout');
exports.interaction = function (stage) { return function (next) { return function (userState) {
    console.log('TODO: add interaction');
    var root = stage.getStageNode();
    var children = root.children;
    children.forEach(function (item) {
        var node = item;
        if (!node.data)
            return;
        if (!node.data.class[NODE_TYPE_1.NODE_TYPE.LINE])
            return;
        setupMouseEnter(node);
        setupMouseOut(node);
    });
    next(userState);
}; }; };
