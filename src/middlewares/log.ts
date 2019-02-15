import { InstanceAPI, PatchBehavior, } from '../cores/core';

export default (instance: InstanceAPI) => (next: PatchBehavior) => (x: any) => {
  console.log('loaded log middleware'); // eslint-disable-line
  return next(x);
};