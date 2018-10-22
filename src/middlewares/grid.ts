import { Stage, PatchFn, TopoData } from '../../typings/defines';
import { h } from '../../node_modules/snabbdom/h';

// Example for middleware that show how to add an event handler
export const grid = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log('before add grid');

  stage.getStageNode().children = stage.getStageNode().children.concat([
    h('line', { attrs: { x1: 800 / 3 * 0, y1: 0, x2: 800 / 3 * 0, y2: 400, }, ns: 'http://www.w3.org/2000/svg' , style: { stroke: 'red' } }),
    h('line', { attrs: { x1: 800 / 3 * 1, y1: 0, x2: 800 / 3 * 1, y2: 400, }, ns: 'http://www.w3.org/2000/svg', style: { stroke: 'red' } }),
    h('line', { attrs: { x1: 800 / 3 * 2, y1: 0, x2: 800 / 3 * 2, y2: 400, }, ns: 'http://www.w3.org/2000/svg', style: { stroke: 'red' } }),
    h('line', { attrs: { x1: 0, y1: 800 / 3 * 0, x2: 800, y2: 800 / 3 * 0, }, ns: 'http://www.w3.org/2000/svg', style: { stroke: 'red' } }),
    h('line', { attrs: { x1: 0, y1: 800 / 3 * 1, x2: 800, y2: 800 / 3 * 1, }, ns: 'http://www.w3.org/2000/svg', style: { stroke: 'red' } }),
    h('line', { attrs: { x1: 0, y1: 800 / 3 * 2, x2: 800, y2: 800 / 3 * 2, }, ns: 'http://www.w3.org/2000/svg', style: { stroke: 'red' } }),
  ]);

  next(userState);

  console.log('after add grid');
};

