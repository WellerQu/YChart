"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var h_1 = require("snabbdom/h");
var styleSheet = "\n/* <![CDATA[ */\ng.group {\n  font-family: Verdana,arial,x-locale-body,sans-serif;\n  letter-spacing: -.3996px;\n  font-size: 12px;\n  cursor: pointer;\n  user-select: none;\n  transition: transform .1s;\n\n  will-change: z-index, transform, opacity;\n}\n\ng.group.line path {\n  transition: d .1s;\n}\n\ng.group.line circle {\n  transition: cx,cy .1s;\n}\n\ng.group.line:hover > path.link-line {\n  stroke-width: 2px;\n  stroke: #61b0ff;\n}\n\ng.group.node:active > circle.health\n, g.group.line:active > path.link-line {\n  opacity: .8;\n}\n\ng.group text.instances {\n  text-anchor: middle;  /* \u6587\u672C\u6C34\u5E73\u5C45\u4E2D */\n  dominant-baseline: middle; /* \u6587\u672C\u5782\u76F4\u5C45\u4E2D */\n  font-size: 16px;\n}\n\ng.group text.title, g text.type {\n  text-anchor: middle;  /* \u6587\u672C\u6C34\u5E73\u5C45\u4E2D */\n}\n\ng.group text.type {\n  fill: white;\n  font-size: 7px;\n}\n/* ]]> */\n";
exports.style = function (stage) { return function (next) { return function (userState) {
    stage.getStageNode().children.push(h_1.h('style', { ns: 'http://www.w3.org/2000/svg' }, styleSheet));
    next(userState);
}; }; };
