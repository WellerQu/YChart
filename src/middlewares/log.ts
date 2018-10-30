import { Stage, PatchFn, TopoData, } from '../../typings/defines';

// Example for middleware that show how to log patch behavior
export const log = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log('patching user data', userState); // eslint-disable-line

  next(userState);
};
