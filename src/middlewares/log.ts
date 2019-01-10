import { InstanceAPI, PatchBehavior, } from '../cores/core';

export default (instance: InstanceAPI) => (next: PatchBehavior) => (x: any) => {
  console.log('before', x); // eslint-disable-line
  next(x);
  console.log('after', x); // eslint-disable-line
};