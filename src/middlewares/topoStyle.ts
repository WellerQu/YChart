import { InstanceAPI, PatchBehavior, TopoData, } from '../cores/core';
import { style, } from '../components/components';
import { VNode, } from 'snabbdom/vnode';

const sheet = `
/* <![CDATA[ */
g.node,
text.line-desc {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  font-size: 12px;
  -webkit-user-select: none;
  user-select: none;

  -webkit-will-change: z-index, transform, opacity, d;
  will-change: z-index, transform, opacity, d; 
}

text.line-desc,
g.node text.node-name,
g.node text.type-name, 
g.node text.instance-count {
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
  pointer-events: none;
}

g.node text.type-name {
  font-size: 7px;
  fill: #FFFFFF;
}

text.line-desc {
  font-size: 10px;
  opacity: .6;
}
/* ]]> */
`;

export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState: TopoData) => {
  instance.getStage().children = [style(sheet),].concat(instance.getStage().children as VNode[]);
  return next(userState);
};
