import { InstanceAPI, PatchBehavior, Size, Viewbox, InstanceState, } from '../cores/core';
import functor from '../cores/functor';
import { VNode, } from 'snabbdom/vnode';

const scaleSize = (size: Size) => (scale: number) => ([ 
  (size.width * scale - size.width) / -2,
  (size.height * scale -size.height) / -2,
  size.width * scale,
  size.height * scale,
]);

export default (instance: InstanceState) => (next: PatchBehavior) => (x: any) => {
  const size = instance.size();
  const scale = instance.scale();

  const viewbox = scaleSize(size)(scale);

  instance.viewbox(viewbox as Viewbox);

  console.log(`current scale is ${1 / scale * 100}%`);

  return next(x);
};