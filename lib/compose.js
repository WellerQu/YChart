"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function compose() {
    var funcs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        funcs[_i] = arguments[_i];
    }
    if (funcs.length === 0) {
        return function (a) { return a; };
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    return funcs.reduce(function (a, b) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return a(b.apply(void 0, args));
    }; });
}
exports.default = compose;