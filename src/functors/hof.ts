import { Functor, ApplicativeFunctor, Fn, Monad, } from '../../typings/functors';

type apCreator = (x: any) => ApplicativeFunctor;
type functorCreator = (x: any) => Functor;
type monadCreator = (x: any) => Monad;

export const ap = (functor: functorCreator): apCreator => (x: any) =>
  Object.assign({}, functor(x), {
    ap: (f: Functor) => f.map(x) as ApplicativeFunctor,
  });

export const chain = (functor: functorCreator): monadCreator => (x: any) => Object.assign(
  {},
  functor(x),
  {
    chain: (f: Fn) => functor(f(x)).join<Monad>(),
  });