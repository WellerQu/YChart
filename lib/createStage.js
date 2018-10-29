"use strict";
/// <reference path="../node_modules/snabbdom/tovnode.d.ts" />
/// <reference path="../node_modules/snabbdom/vnode.d.ts" />
/// <reference path="../node_modules/snabbdom/snabbdom.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/attributes.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/style.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/class.d.ts" />
/// <reference path="../node_modules/snabbdom/modules/eventlisteners.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var tovnode_1 = require("snabbdom/tovnode");
var snabbdom_1 = require("snabbdom/snabbdom");
var attributes_1 = require("snabbdom/modules/attributes");
var style_1 = require("snabbdom/modules/style");
var class_1 = require("snabbdom/modules/class");
var eventlisteners_1 = require("snabbdom/modules/eventlisteners");
var components_1 = require("./components/components");
var vPatch = snabbdom_1.init([
    class_1.default,
    style_1.default,
    attributes_1.default,
    eventlisteners_1.default
]);
function createStage(container) {
    var svgOption = {
        width: container.parentElement.offsetWidth,
        height: container.parentElement.offsetHeight,
    };
    var currentNode = components_1.createSvg(svgOption);
    var previousNode = tovnode_1.default(container);
    var subscribers = [];
    function create(strategy) {
        return strategy(currentNode);
    }
    function subscribe(handler) {
        subscribers.push(handler);
        return function () { return subscribers = subscribers.filter(function (fn) { return fn !== handler; }); };
    }
    function getStageNode() {
        return currentNode;
    }
    function patch(userState) {
        previousNode = vPatch(previousNode, currentNode);
        currentNode = components_1.createSvg(svgOption);
        subscribers.forEach(function (handler) { return handler(userState); });
        return previousNode;
    }
    return {
        getStageNode: getStageNode,
        create: create,
        subscribe: subscribe,
        patch: patch
    };
}
exports.default = createStage;
