import { VNode } from '../node_modules/snabbdom/vnode'

import compose from './compose'
import { Stage, MiddlewareFn, CreateStageFn, PatchFn } from '../typings/defines'

const applyMiddlewares = (...middlewares: MiddlewareFn[]) => (
  createStage: CreateStageFn
) => (initNode: VNode): Stage => {
  const stage = createStage(initNode)
  let patch: PatchFn = (): never => {
    throw new Error('Early to call')
  }

  const middlewareAPI: Stage = {
    ...stage,
    patch: (userState?: any) => patch(userState)
  }

  const chain = middlewares.map(fn => fn(middlewareAPI))
  patch = compose<PatchFn>(...chain)(stage.patch)

  return {
    ...stage,
    patch
  }
}

export default applyMiddlewares
