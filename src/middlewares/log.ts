import { InstanceAPI, PatchBehavior, } from '../cores/core';

export default (instance: InstanceAPI) => (next: PatchBehavior) => (x: any) => {
  console.log('there are', x); // eslint-disable-line
  return next(x);
};