import { InstanceAPI, PatchBehavior, TopoData, } from '../cores/core';

export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState?: TopoData) => {
  return next(userState);
};