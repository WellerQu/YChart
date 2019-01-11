import { Functor, } from './core';

const left = (x: any): Functor => ({
  map: (f: Function) => left(x),
  fold: (f: Function) => f(x),
  ap: (f: Functor) => f.map(x),
  chain: (f: Function) => left(f(x)).fold((x: any) => x),
});

left.of = (x: any) => left(x);

export default left;