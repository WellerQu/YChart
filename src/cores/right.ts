import { Functor, } from './core';
import id from './id';

const right = (x: any): Functor => ({
  map: (f: Function) => right(f(x)),
  fold: (_: Function, g: Function) => g(x),
  ap: (f: Functor) => f.map(x),
  chain: (f: Function) => right(f(x)).fold(id, id),
});

right.of = (x: any) => right(x);

export default right;