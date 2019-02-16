import { InstanceAPI, PatchBehavior, TopoData, } from '../cores/core';
import { style, } from '../components/components';
import { VNode, } from 'snabbdom/vnode';

const TRANSITION_TIME = '0.6s';

const sheet = `
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

/*
g.node {
  transition: transform ${TRANSITION_TIME} linear;
}

path.line,
path.arrow {
  transition: d ${TRANSITION_TIME} linear;
}

svg.dragging g.node,
svg.dragging path.line,
svg.dragging path.arrow {
  transition: none;
}
*/

g.node.weak,
path.line.weak,
path.arrow.weak,
text.line-desc.weak {
  opacity: .2;
}

g.node text,
text.line-desc {
  pointer-events: none;
}

text.line-desc,
g.node text.node-name,
g.node text.type-name, 
g.node text.instance-count {
  text-anchor: middle;
  dominant-baseline: middle;
}

g.node text.type-name {
  font-size: 7px;
  fill: #FFFFFF;
}

text.line-desc {
  font-size: 10px;
  opacity: .6;
}
`;

export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState: TopoData) => {
  instance.getStage().children = [style(sheet),].concat(instance.getStage().children as VNode[]);
  return next(userState);
};
