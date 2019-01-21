import { Middleware, PatchBehavior, InstanceAPI, StateCreator, InstanceCreator, } from './core';
import compose from '../compose';

export default (...middlewares: Middleware[]) => (
  createInstance: InstanceCreator
): InstanceCreator => (option: any) => {
  let patch: PatchBehavior = (): never => {
    throw new Error('Not implement');
  };

  const instance = createInstance(option);
  const api: InstanceAPI = {
    ...instance,
    patch: (userState?: any) => patch(userState),
  };

  const chain = middlewares.map(fn => fn(api));
  patch = compose<PatchBehavior>(...chain)(instance.patch);

  return {
    ...instance,
    patch,
  };
};