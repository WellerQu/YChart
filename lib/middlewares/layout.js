"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var NODE_TYPE_1 = require("../NODE_TYPE");
var utils_1 = require("../utils");
var placeNode = function (columnIndex) { return function (nodes) {
    var space = (constants_1.CELL_SIZE - constants_1.NODE_SIZE) / 2;
    return nodes.map(function (item, rowIndex) {
        return {
            vnode: __assign({}, item, { data: __assign({}, item.data, { style: {
                        transform: utils_1.toTranslate(constants_1.CELL_SIZE * columnIndex + space, constants_1.CELL_SIZE * rowIndex + space),
                    } }) }),
            x: constants_1.CELL_SIZE * columnIndex + space,
            y: constants_1.CELL_SIZE * rowIndex + space,
            id: item.data.attrs.id,
        };
    });
}; };
var linkLine = function (nodePool) { return function (lines) {
    return lines.map(function (item) {
        var id = item.data.attrs['id'];
        if (!id.split)
            return item;
        var _a = id.split('-'), source = _a[0], target = _a[1];
        var s = nodePool.find(function (n) { return n.id === source; });
        var t = nodePool.find(function (n) { return n.id === target; });
        if (!s || !t)
            return item;
        var line = item.children[0];
        if (!line)
            return item;
        var arrow = item.children[1];
        if (!arrow)
            return item;
        var x1 = s.x + constants_1.NODE_SIZE / 2;
        var y1 = s.y + constants_1.NODE_SIZE / 2;
        var x2 = t.x + constants_1.NODE_SIZE / 2;
        var y2 = t.y + constants_1.NODE_SIZE / 2;
        var lA = y2 - y1;
        var lB = x2 - x1;
        var lC = Math.sqrt(Math.pow(lA, 2) + Math.pow(lB, 2));
        var lc = constants_1.ARROW_OFFSET;
        var la = lc * lA / lC;
        var lb = lc * lB / lC;
        var arrowX = lb + x1;
        var arrowY = la + y1;
        arrow.data.attrs.d = utils_1.toArrowD(arrowX, arrowY);
        var a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90;
        arrow.data.attrs.transform = "rotate(" + a + ", " + arrowX + " " + arrowY + ")";
        line.data.attrs.d = "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
        return __assign({}, item);
    });
}; };
var placeUserGroup = placeNode(0);
var placeServerGroup = placeNode(1);
var placeOtherGroup = placeNode(2);
exports.layout = function (stage) { return function (next) { return function (userState) {
    var root = stage.getStageNode();
    var nodes = stage.getStageNode().children;
    var userGroup = [];
    var serverGroup = [];
    var otherGroup = [];
    var lineGroup = [];
    var restGroup = [];
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        if (!node.data || !node.data.class) {
            restGroup.push(node);
            continue;
        }
        var classNames = node.data.class;
        if (classNames[NODE_TYPE_1.NODE_TYPE.LINE]) {
            lineGroup.push(node);
            continue;
        }
        if (classNames[NODE_TYPE_1.NODE_TYPE.USER]) {
            userGroup.push(node);
            continue;
        }
        if (classNames[NODE_TYPE_1.NODE_TYPE.SERVER]) {
            serverGroup.push(node);
            continue;
        }
        otherGroup.push(node);
    }
    var placedUserGroup = placeUserGroup(userGroup);
    var placedServiceGroup = placeServerGroup(serverGroup);
    var placedOtherGroup = placeOtherGroup(otherGroup);
    var allElements = placedUserGroup.concat(placedServiceGroup, placedOtherGroup);
    var placeLineGroup = linkLine(allElements);
    var placedLineGroup = placeLineGroup(lineGroup);
    root.children = restGroup.concat(placedLineGroup, placedUserGroup.map(function (n) { return n.vnode; }), placedServiceGroup.map(function (n) { return n.vnode; }), placedOtherGroup.map(function (n) { return n.vnode; }));
    next(userState);
}; }; };
