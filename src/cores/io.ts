import compose from '../compose';
import { Functor, } from './core';

const io = (f: Function) => ({
  map: (g: Function) => io(compose(f, g)),
  ap: (m: Functor) => m.map(f),
});

export default io;