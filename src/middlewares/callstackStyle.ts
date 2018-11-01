/// <reference path="../../node_modules/snabbdom/h.d.ts" />

import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import { h, } from 'snabbdom/h';

const fontSize = '8px';
const styleSheet = `
/* <![CDATA[ */
g.group
, text.calibration {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  cursor: pointer;
  user-select: none;

  will-change: z-index, transform, opacity;
}

g.group.callstack:hover > rect {
  opacity: 0.6;
}

g.group.callstack > text:nth-child(2) {
  stroke: hsl(0, 0%, 100%);
  stroke-width: 2px;
}

g.group.callstack > text.callstack-desc {
  font-size: ${fontSize};
}

text.calibration {
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
  font-size: ${fontSize};
  user-select: none;
  pointer-event: none;
}
/* ]]> */
`;

export const callstackStyle = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  stage.stageNode().children.push(
    h('style', { ns: 'http://www.w3.org/2000/svg', }, styleSheet)
  );

  next(userState);
};
