"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lineColor = '#2693ff';
function createArrowLineOption(line) {
    var id = line.source + "-" + line.target;
    return {
        x: 0,
        y: 0,
        fill: lineColor,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        strokeColor: lineColor,
        strokeWidth: 1,
        id: id,
        className: 'line',
        text: line.elapsedTime + " ms",
    };
}
exports.default = createArrowLineOption;
