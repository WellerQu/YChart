"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var compose_1 = require("../compose");
var NODE_TYPE_1 = require("../NODE_TYPE");
var handlerHelper = function (handleNodeEvent, handleLineEvent, data) { return function (event) {
    var element = event.target;
    if (!element.nodeName)
        return event;
    while (element.nodeName.toUpperCase() !== 'G' && element.nodeName.toUpperCase() !== 'SVG') {
        element = element.parentElement;
    }
    if (element.classList.contains(NODE_TYPE_1.NODE_TYPE.NODE)) {
        var node = data
            ? data.nodes.find(function (n) { return n.id === element.getAttribute('id'); })
            : null;
        handleNodeEvent && handleNodeEvent(event, node);
    }
    else if (element.classList.contains('line')) {
        var line = data
            ? data.links.find(function (n) { return n.source + "-" + n.target === element.getAttribute('id'); })
            : null;
        handleLineEvent && handleLineEvent(event, line);
    }
    return event;
}; };
exports.event = function (options) { return function (stage) { return function (next) { return function (userState) {
    var root = stage.getStageNode();
    var handleClick = handlerHelper(options['nodeClick'], options['lineClick'], userState);
    var handleMouseOver = handlerHelper(options['nodeMouseOver'], options['lineMouseOver'], userState);
    var handleMouseOut = handlerHelper(options['nodeMouseOut'], options['lineMouseOut'], userState);
    var setupEvent = compose_1.default(utils_1.setupEventHandler(handleClick)('click'), utils_1.setupEventHandler(handleMouseOut)('mouseout'), utils_1.setupEventHandler(handleMouseOver)('mouseover'));
    setupEvent(root);
    next(userState);
}; }; }; };
