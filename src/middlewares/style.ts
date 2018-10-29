/// <reference path="../../node_modules/snabbdom/h.d.ts" />

import { Stage, PatchFn, TopoData } from '../../typings/defines';
import { h } from 'snabbdom/h';

const styleSheet = `
/* <![CDATA[ */
g.group {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;

  will-change: z-index, transform, opacity;
}

g.group.node {
  transition: transform .1s;
}

g.group.node:active > circle.health
, g.group.line:active > path.link-line {
  opacity: .8;
}

g.group.node text.instances
, g.group.line text.line-desc {
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
  font-size: 16px;
}

g.group.node text.title
, g.group.node text.type {
  text-anchor: middle;  /* 文本水平居中 */
}

g.group.node text.type {
  fill: white;
  font-size: 7px;
}

g.group.line path.link-line {
  transition: d .1s;
}

g.group.line circle {
  transition: cx,cy .1s;
}

g.group.line:hover > path.link-line {
  stroke-width: 2px;
  stroke: #61b0ff;
}

g.group.line:hover > text.line-desc {
  stroke-opacity: 0;
  font-size: 14px;
}

g.group.line text.line-desc {
  stroke: hsl(0, 0%, 100%);
  stroke-width: 2px;
  stroke-opacity: .5;
  fill: #000;
  fill-opacity: 1;
  font-size: 10px;
}

/* ]]> */
`;

export const style = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  stage.getStageNode().children.push(
    h('style', { ns: 'http://www.w3.org/2000/svg' }, styleSheet)
  );

  next(userState);
};
