import { Functor, } from './core';

const sideEffect = (f: Function) => ({
  map: (g: Function) => sideEffect(() => g(f())),
  fold: (g: Function) => g(f()),
});

sideEffect.of = (f: Function) => sideEffect(f);

export default sideEffect;