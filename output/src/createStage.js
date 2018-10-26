"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tovnode_1 = require("../node_modules/snabbdom/tovnode");
var snabbdom_1 = require("../node_modules/snabbdom/snabbdom");
var attributes_1 = require("../node_modules/snabbdom/modules/attributes");
var style_1 = require("../node_modules/snabbdom/modules/style");
var class_1 = require("../node_modules/snabbdom/modules/class");
var eventlisteners_1 = require("../node_modules/snabbdom/modules/eventlisteners");
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
