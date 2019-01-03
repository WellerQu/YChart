import { Fn, Functor,} from '../../typings/functors';

export const left = (x: any): Functor => ({
  value: x,
  map: (f: Fn) => left(x),
  chain: (f: Fn) => left(x),
  ap: (f: Functor) => f.map(x),
  fold: (f: Fn, g: Fn) => f(x),
});

export const right = (x: any): Functor => ({
  value: x,
  map: (f: Fn) => right(f(x)),
  chain: (f: Fn) => f(x),
  ap: (f: Functor) => f.map(x),
  fold: (f: Fn, g: Fn) => g(x),
});