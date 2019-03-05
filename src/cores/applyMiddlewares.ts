import { Middleware, PatchBehavior, InstanceAPI, } from './core';
import compose from '../compose';

export default (...middlewares: Middleware[]) => (instance: InstanceAPI) => {
  let patch: PatchBehavior = (): never => {
    throw new Error('Not implement');
  };

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