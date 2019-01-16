import { InstanceAPI, PatchBehavior, TopoData, } from '../cores/core';
import functor from '../cores/functor';
import { VNode, } from 'snabbdom/vnode';
import sideEffect from '../cores/sideEffect';
import id from '../cores/id';

/**
 * @module middlewares
 */

/**
 * 拓扑图布局策略 - 力导向布局
 */
export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState: TopoData) => {
  functor(instance)
    .map((ins: InstanceAPI) => ins.getStage())
    .map(($stage: VNode) => $stage.children)
    .map((children: VNode[]) => children.filter(n => n.data.class))
    .map((children: VNode[]) => children.filter(n => n.data.class['group']))
    .chain((nodes: VNode[]) => sideEffect(() => {
      if ( nodes.length === 0 )
        return nodes;

      console.log(nodes);

      return nodes;
    }))
    .fold(id);
  next(userState);
};