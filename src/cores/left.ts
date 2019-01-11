import { Functor, } from './core';
import id from './id';

const left = (x: any): Functor => ({
  __value__: `left( ${x})`,
  map: (_: Function) => left(x),
  fold: (f: Function, g: Function) => f(x),
  ap: (f: Functor) => f.map(x),
  chain: (f: Function) => left(f(x)).fold(id),
});

left.of = (x: any) => left(x);

export default left;