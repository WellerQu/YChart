"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compose_1 = require("./compose");
var constants_1 = require("./constants");
exports.setupEventHandler = function (handler) { return function (eventName) { return function (vnode) {
    if (!vnode.data.on) {
        vnode.data.on = {};
    }
    if (vnode.data.on[eventName]) {
        vnode.data.on[eventName] = compose_1.default(vnode.data.on[eventName], handler);
    }
    else {
        vnode.data.on[eventName] = handler;
    }
    return vnode;
}; }; };
exports.throttle = function (handler, gapTime) {
    var lastTime = 0;
    return function (event) {
        var nowTime = +new Date;
        if (nowTime - lastTime > gapTime) {
            lastTime = nowTime;
            return handler(event);
        }
        return event;
    };
};
function memory(fn, resolver) {
    var memories = new Map();
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var key = resolver ? resolver.apply(void 0, args) : args[0];
        var result = memories.get(key);
        if (!result)
            return memories.set(key, fn.apply(void 0, args)).get(key);
        return result;
    };
}
exports.memory = memory;
exports.clamp = function (min, max) { return function (value) {
    return value < min ? min : value > max ? max : value;
}; };
exports.parseViewBoxValue = function (value) { return value.split(',').map(function (n) { return +n; }); };
exports.parseTranslate = function (value) {
    var regExp = /^translate\((-?\d+(\.\d+)?)px,\s*(-?\d+(\.\d+)?)px\)$/igm;
    if (!regExp.test(value))
        throw new Error("can NOT convert to Position: " + value);
    return {
        x: +RegExp.$1,
        y: +RegExp.$3,
    };
};
exports.toViewBox = function (x, y, width, height) { return x + "," + y + "," + width + "," + height; };
function toTranslate() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length > 1) {
        var x = args[0], y = args[1];
        return "translate(" + x + "px, " + y + "px)";
    }
    if (args.length === 1) {
        var _a = args[0], x = _a.x, y = _a.y;
        return "translate(" + x + "px, " + y + "px)";
    }
    return "translate(" + 0 + "px, " + 0 + "px)";
}
exports.toTranslate = toTranslate;
exports.toArrowD = function (x, y, width, height) {
    if (width === void 0) { width = constants_1.ARROW_WIDTH; }
    if (height === void 0) { height = constants_1.ARROW_HEIGHT; }
    return "M" + x + "," + (y - height / 2) + " L" + (x - width / 2) + "," + (y + height / 2) + " L" + (x + width / 2) + "," + (y + height / 2) + " Z";
};
exports.max = function () {
    var nums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i] = arguments[_i];
    }
    var head = nums[0], tail = nums.slice(1);
    var _max = function (x) { return function (y) { return x > y ? x : y; }; };
    var getResult = compose_1.default.apply(void 0, tail.map(function (n) { return _max(n); }));
    return getResult(head);
};
