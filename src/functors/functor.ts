import { Creator, MapFunction, Functor, } from '../../typings/functors';

const functor = <Creator>((x: any) => ({
  value: x,
  map: (f: MapFunction) => functor(f(x)),
  ap: (a: Functor) => a.map(x),
  chain: (f: MapFunction) => functor(f(x)).value,
}));

functor.of = (x: any) => functor(x);

export default functor;