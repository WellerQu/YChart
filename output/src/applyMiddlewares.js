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
var compose_1 = require("./compose");
var applyMiddlewares = function () {
    var middlewares = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        middlewares[_i] = arguments[_i];
    }
    return function (createStage) { return function (container) {
        var stage = createStage(container);
        var patch = function () {
            throw new Error('Early to call');
        };
        var middlewareAPI = __assign({}, stage, { patch: function (userState) { return patch(userState); } });
        var chain = middlewares.map(function (fn) { return fn(middlewareAPI); });
        patch = compose_1.default.apply(void 0, chain)(stage.patch);
        return __assign({}, stage, { patch: patch });
    }; };
};
exports.default = applyMiddlewares;
