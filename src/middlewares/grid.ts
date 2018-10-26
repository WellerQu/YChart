import { Stage, PatchFn, TopoData } from '../../typings/defines';

// Example for middleware that show how to add an event handler
export const grid = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log('TODO: add grid'); // eslint-disable-line

  next(userState);
};

