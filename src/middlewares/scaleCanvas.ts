import { InstanceAPI, PatchBehavior, Size, Viewbox, InstanceState, } from '../cores/core';

const scaleSize = (size: Size) => (scale: number) => ([ 
  (size.width * scale - size.width) / -2,
  (size.height * scale -size.height) / -2,
  size.width * scale,
  size.height * scale,
]);

export default (instance: InstanceAPI) => (next: PatchBehavior) => (x: any) => {
  const state = instance as InstanceState;
  const size = state.size();
  const scale = state.scale();

  console.log(`loaded scale canvas middleware, current scale is ${1 / scale * 100}%`); // eslint-disable-line

  const viewbox = scaleSize(size)(scale);

  instance.viewbox(viewbox as Viewbox);

  return next(x);
};