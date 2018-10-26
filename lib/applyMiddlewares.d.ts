import { Stage, MiddlewareFn, CreateStageFn } from '../typings/defines';
declare const applyMiddlewares: (...middlewares: MiddlewareFn[]) => (createStage: CreateStageFn) => (container: HTMLElement) => Stage;
export default applyMiddlewares;
