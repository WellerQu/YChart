import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';
import { createStyle, } from '../components/components';

const styleSheet = `
/* <![CDATA[ */
g.group {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;

  will-change: z-index, transform, opacity, d;
}

g.group.weak {
  opacity: .1;
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
  pointer-events: none;
}

g.group.node text.title
, g.group.node text.type {
  text-anchor: middle;  /* 文本水平居中 */
  pointer-events: none;
}

g.group.node text.type {
  fill: white;
  font-size: 7px;
  pointer-events: none;
}

g.group.node text.elapsedTime
, g.group.node text.rpm
, g.group.node text.epm {
  font-size: 10px;
  stroke: hsl(0, 0%, 100%);
  stroke-opacity: .2;
  stroke-width: 2px;
}

g.group.line path {
  pointer-events: none;
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

export const topoStyle = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {
  stage.create(createStyle(styleSheet));

  next(userState);
};
