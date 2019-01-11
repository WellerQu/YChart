import compose from '../compose';
import { Functor, } from './core';
import id from './id';

const io = (f: Function): Functor => ({
  map: (g: Function) => io(compose(f, g)),
  ap: (m: Functor) => m.map(f),
  fold: (g: Function) => g(f),
  chain: (g: Function) => io(f).map(g).fold(id),
});

export default io;