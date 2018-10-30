/// <reference path="../../node_modules/snabbdom/h.d.ts" />

import { Stage, PatchFn, TopoData, } from '../../typings/defines';
import { h, } from 'snabbdom/h';

const styleSheet = `
/* <![CDATA[ */
g.group
, text.calibration {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;

  will-change: z-index, transform, opacity;
}

g.group.callstack > text:nth-child(2) {
  stroke: hsl(0, 0%, 100%);
  stroke-width: 2px;
}

text.calibration {
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
  font-size: 10px;
  user-select: none;
  pointer-event: none;
}
/* ]]> */
`;

export const callstackStyle = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  stage.getStageNode().children.push(
    h('style', { ns: 'http://www.w3.org/2000/svg', }, styleSheet)
  );

  next(userState);
};
