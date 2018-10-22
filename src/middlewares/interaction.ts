import { Stage, PatchFn, TopoData } from '../../typings/defines';
import { VNode } from '../../node_modules/snabbdom/vnode';

// Example for middleware that show how to add an event handler
export const interaction = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log('before add interaction');

  const target = stage.getStageNode().children.find((n: VNode) => n.sel === 'g');
  if (target as VNode && (<VNode>target).data) {
    (<VNode>target).data.on = {
      click: (event: MouseEvent) => console.log('Hello World', event)
    };
  }

  next(userState);

  console.log('after add interaction');
};

