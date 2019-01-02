import { Fn, Functor, } from '../../typings/functors';

const functor = ((x: any): Functor => ({
  value: x,
  map: (f: Fn) => functor(f(x)),
  ap: (f: Functor) => f.map(x),
  chain: (f: Fn) => functor(f(x)).join(),
  join: () => x,
  fold: (f: Fn) => f(x),
}));

export default functor;