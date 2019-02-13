import { InstanceAPI, PatchBehavior, TopoData, } from '../cores/core';
import { style, } from '../components/components';
import { VNode } from 'snabbdom/vnode';

const sheet = `
/* <![CDATA[ */
g.node {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  font-size: 12px;
  -webkit-user-select: none;
  user-select: none;

  -webkit-will-change: z-index, transform, opacity, d;
  will-change: z-index, transform, opacity, d; 
}

g.node text {
  pointer-events: none;
}

g.node text.node-name,
g.node text.type-name, 
g.node text.instance-count {
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
}

g.node text.type-name {
  font-size: 7px;
  fill: #FFFFFF;
}
/* ]]> */
`;

export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState: TopoData) => {
  instance.getStage().children = [style(sheet)].concat(instance.getStage().children as VNode[]);
  return next(userState);
};
