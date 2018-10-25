import { Stage, PatchFn, TopoData } from '../../typings/defines';
import { h } from '../../node_modules/snabbdom/h';

// Example for middleware that show how to add an event handler
export const grid = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log('TODO: add grid');

  next(userState);
};

