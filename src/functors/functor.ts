import { Fn, ApplicativeFunctor, Monad, } from '../../typings/functors';
import { ap, chain, } from './hof';

import compose from '../compose';

const hof = compose<(x: any) => ApplicativeFunctor & Monad>(chain, ap,);

const functor = hof((x: any) => ({
  value: x,
  map: (f: Fn) => hof(functor)(f(x)),
  join: () => x,
}));

export default functor;