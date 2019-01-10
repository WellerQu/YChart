import { Functor, } from './core';

const functor = (x: any): Functor => ({
  map: (f: Function) => functor(f(x)),
  ap: (f: Functor) => f.map(x),
  fold: (f: Function) => f(x),
});

export default functor;