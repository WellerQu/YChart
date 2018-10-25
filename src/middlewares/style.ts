import { Stage, PatchFn, TopoData } from '../../typings/defines';
import { h } from '../../node_modules/snabbdom/h';

const styleSheet = `
/* <![CDATA[ */
g.group {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  transition: transform .1s;

  will-change: z-index, transform, opacity;
}

g.group.line path {
  transition: d .1s;
}

g.group.line circle {
  transition: cx,cy .1s;
}

g.group.line:hover > path {
  stroke-width: 2px;
  stroke: #61b0ff;
}

g.group.node:active > circle.health,
g.group.node:active > image {
  /*
  transform: scale(1.2);
  transform-origin: 50px 59px;
  */
  opacity: .8;
}

g.group text.instances {
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
  font-size: 16px;
}

g.group text.title, g text.type {
  text-anchor: middle;  /* 文本水平居中 */
}

g.group text.type {
  fill: white;
  font-size: 7px;
}
/* ]]> */
`;

export const style = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  stage.getStageNode().children.push(
    h('style', { ns: 'http://www.w3.org/2000/svg' }, styleSheet)
  );

  next(userState);
};
