import compose from './compose';
import { Stage, MiddlewareFn, CreateStageFn, PatchFn } from '../typings/defines';

const applyMiddlewares = (...middlewares: MiddlewareFn[]) => (
  createStage: CreateStageFn
) => (container: HTMLElement): Stage => {
  const stage = createStage(container);
  let patch: PatchFn = (): never => {
    throw new Error('Early to call');
  };

  const middlewareAPI: Stage = {
    ...stage,
    patch: (userState?: any) => patch(userState)
  };

  const chain = middlewares.map(fn => fn(middlewareAPI));
  patch = compose<PatchFn>(...chain)(stage.patch);

  return {
    ...stage,
    patch
  };
};

export default applyMiddlewares;
