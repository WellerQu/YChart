"use strict";
/// <reference path="../../node_modules/snabbdom/h.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var h_1 = require("snabbdom/h");
var styleSheet = "\n/* <![CDATA[ */\ng.group {\n  font-family: Verdana,arial,x-locale-body,sans-serif;\n  letter-spacing: -.3996px;\n  font-size: 12px;\n  cursor: pointer;\n  user-select: none;\n\n  will-change: z-index, transform, opacity;\n}\n\ng.group.node {\n  transition: transform .1s;\n}\n\ng.group.node:active > circle.health\n, g.group.line:active > path.link-line {\n  opacity: .8;\n}\n\ng.group.node text.instances\n, g.group.line text.line-desc {\n  text-anchor: middle;  /* \u6587\u672C\u6C34\u5E73\u5C45\u4E2D */\n  dominant-baseline: middle; /* \u6587\u672C\u5782\u76F4\u5C45\u4E2D */\n  font-size: 16px;\n}\n\ng.group.node text.title\n, g.group.node text.type {\n  text-anchor: middle;  /* \u6587\u672C\u6C34\u5E73\u5C45\u4E2D */\n}\n\ng.group.node text.type {\n  fill: white;\n  font-size: 7px;\n}\n\ng.group.line path.link-line {\n  transition: d .1s;\n}\n\ng.group.line circle {\n  transition: cx,cy .1s;\n}\n\ng.group.line:hover > path.link-line {\n  stroke-width: 2px;\n  stroke: #61b0ff;\n}\n\ng.group.line:hover > text.line-desc {\n  stroke-opacity: 0;\n  font-size: 14px;\n}\n\ng.group.line text.line-desc {\n  stroke: hsl(0, 0%, 100%);\n  stroke-width: 2px;\n  stroke-opacity: .5;\n  fill: #000;\n  fill-opacity: 1;\n  font-size: 10px;\n}\n\n/* ]]> */\n";
exports.style = function (stage) { return function (next) { return function (userState) {
    stage.getStageNode().children.push(h_1.h('style', { ns: 'http://www.w3.org/2000/svg' }, styleSheet));
    next(userState);
}; }; };
