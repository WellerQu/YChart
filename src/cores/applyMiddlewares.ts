import { Middleware, InstanceCreator, PatchBehavior, InstanceState, } from './core';
import compose from '../compose';

export default (...middlewares: Middleware[]) => (
  createInstance: InstanceCreator
) => (option: any) => {
  let patch: PatchBehavior = (): never => {
    throw new Error('Not implement');
  };

  const instance = createInstance(option);
  const api: InstanceState = {
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