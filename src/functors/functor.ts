import { Creator, Functor, Fn, ApplicativeFunctor, } from '../../typings/functors';

const functor: Creator = (x: any) => ({
  map: (f: Fn) => functor(f(x)),
  join: () => x,
  ap: (f: Functor) => f.map(x) as ApplicativeFunctor,
  chain: (f: Fn) => functor(f(x)).join(),
  id: x => x,
});

export default functor;