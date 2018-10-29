"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Example for middleware that show how to log patch behavior
exports.log = function (stage) { return function (next) { return function (userState) {
    console.log('patching user data', userState); // eslint-disable-line
    next(userState);
}; }; };
