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
var h_1 = require("../../node_modules/snabbdom/h");
var utils_1 = require("../utils");
var parseClassName = function (classNames) {
    if (!classNames)
        return {};
    return classNames
        .split(' ')
        .reduce(function (classObject, key) {
        classObject[key] = true;
        return classObject;
    }, {});
};
exports.createSvg = function (option) {
    return h_1.h('svg', {
        attrs: {
            width: option.width,
            height: option.height,
            viewBox: "0, 0, " + option.width + ", " + option.height,
        }
    }, []);
};
exports.createGroup = function (option) {
    var classObject = parseClassName(option.className);
    return h_1.h('g', {
        class: __assign({}, classObject, { group: true }),
        style: { transform: "translate(" + (option.x || 0) + "px, " + (option.y || 0) + "px)" },
        ns: 'http://www.w3.org/2000/svg',
        key: option.id,
        attrs: {
            id: option.id,
        },
    }, []);
};
exports.createImage = function (option) { return function (parentNode) {
    var width = option.width || 50;
    var height = option.height || 50;
    var classObject = parseClassName(option.className);
    parentNode.children.push(h_1.h('image', {
        attrs: {
            'xlink:href': option.URL,
            width: width,
            height: height,
            x: option.x,
            y: option.y,
        },
        class: __assign({}, classObject),
        ns: 'http://www.w3.org/2000/svg',
    }));
    return parentNode;
}; };
exports.createText = function (option) { return function (parentNode) {
    var classObject = parseClassName(option.className);
    parentNode.children.push(h_1.h('text', {
        attrs: { x: option.x, y: option.y },
        class: __assign({}, classObject),
        ns: 'http://www.w3.org/2000/svg',
    }, option.content));
    return parentNode;
}; };
exports.createCircle = function (option) { return function (parentNode) {
    var classObject = parseClassName(option.className);
    parentNode.children.push(h_1.h('circle', {
        attrs: {
            cx: option.cx,
            cy: option.cy,
            r: option.radius,
            fill: option.fill
        },
        class: __assign({}, classObject),
        ns: 'http://www.w3.org/2000/svg',
    }));
    return parentNode;
}; };
exports.createLine = function (option) { return function (parentNode) {
    parentNode.children.push(h_1.h('path', {
        attrs: {
            d: "M" + option.x1 + "," + option.y1 + " Q" + ((option.x2 - option.x1) / 2 +
                option.x1) + "," + (option.y1 + 50) + " " + option.x2 + "," + option.y2,
            fill: 'none',
            stroke: option.strokeColor,
            'stroke-width': option.strokeWidth,
        },
        class: { 'link-line': true, },
        ns: 'http://www.w3.org/2000/svg',
    }));
    return parentNode;
}; };
exports.createArrow = function (option) { return function (pardentNode) {
    var x = option.x, y = option.y, width = option.width, height = option.height;
    pardentNode.children.push(h_1.h('path', {
        attrs: {
            d: utils_1.toArrowD(x, y, width, height),
            fill: option.fill,
            transform: 'rotate(0, 0 0)',
        },
        class: { arrow: true },
        ns: 'http://www.w3.org/2000/svg'
    }));
    pardentNode.children.push(h_1.h('animateMotion', {
        attrs: { dur: '3s', repeatCount: 'indefinite', 'xlink:href': "#C" + option.id },
        ns: 'http://www.w3.org/2000/svg'
    }, []));
    return pardentNode;
}; };
