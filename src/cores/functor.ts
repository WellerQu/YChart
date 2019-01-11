import { Functor, } from './core';
import id from './id';

const functor = (x: any): Functor => ({
  map: (f: Function) => functor(f(x)),
  fold: (f: Function) => f(x),
  chain: (f: Function) => functor(x).map(f).fold(id),
  ap: (f: Functor) => f.map(x),
});

functor.of = (x: any) => functor(x);

export default functor;