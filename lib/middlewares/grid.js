"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Example for middleware that show how to add an event handler
exports.grid = function (stage) { return function (next) { return function (userState) {
    console.log('TODO: add grid'); // eslint-disable-line
    next(userState);
}; }; };
