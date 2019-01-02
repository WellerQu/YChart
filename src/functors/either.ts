import { Fn, ApplicativeFunctor, Monad, EitherFunctor, } from '../../typings/functors';
import { ap, } from './hof';

import compose from '../compose';

const hof = compose<(x: any) => ApplicativeFunctor & Monad & EitherFunctor>(ap);

export const left = hof((x: any) => ({
  value: x,
  map: (f: Fn) => left(x),
  chain: (f: Fn) => left(x),
  join: () => x,
  fold: (f: Fn, g: Fn) => f(x),
}));

export const right = hof((x: any) => ({
  value: x,
  map: (f: Fn) => right(f(x)),
  chain: (f: Fn) => f(x),
  join: () => x,
  fold: (f: Fn, g: Fn) => g(x),
}));