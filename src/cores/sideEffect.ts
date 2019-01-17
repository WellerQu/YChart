import { Functor, } from './core';

const sideEffect = (f: Function): Functor => ({
  __value__: f,
  map: (g: Function) => sideEffect(() => g(f())),
  fold: (g: Function) => g(f()),
  chain: (g: Function) => g(f),
  ap: (g: Functor) => g.map(f),
});

sideEffect.of = (f: Function) => sideEffect(f);

export default sideEffect;