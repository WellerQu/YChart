"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = function (stage) { return function (next) { return function (userState) {
    console.log('patching user data', userState);
    next(userState);
}; }; };
