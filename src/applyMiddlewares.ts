import compose from './compose';
import { Stage, Middleware, CreateStage, PatchBehavior, } from '../typings/defines';

const applyMiddlewares = (...middlewares: Middleware[]) => (
  createStage: CreateStage
) => (container: HTMLElement): Stage => {
  const stage = createStage(container);
  let patch: PatchBehavior = (): never => {
    throw new Error('Early to call');
  };

  const middlewareAPI: Stage = {
    ...stage,
    patch: (userState?: any) => patch(userState),
  };

  const chain = middlewares.map(fn => fn(middlewareAPI));
  patch = compose<PatchBehavior>(...chain)(stage.patch);

  return {
    ...stage,
    patch,
  };
};

export default applyMiddlewares;
