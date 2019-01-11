import { Functor, } from './core';

const right = (x: any): Functor => ({
  map: (f: Function) => right(f(x)),
  fold: (f: Function) => f(x),
  ap: (f: Functor) => f.map(x),
  chain: (f: Function) => right(f(x)).fold((x: any) => x),
});

right.of = (x: any) => right(x);

export default right;