
// export type Creator = (x: any) => ( Functor & ApplicativeFunctor & Monad & Monoid );
export type Fn = (x: any) => any;

export type TwoArgsFn = (f: Fn, g: Fn) => any;
export type OneArgsFn = (f: Fn) => any;

export interface Functor {
  value: any;
  map: (f: Fn) => Functor;
  join: <T>() => T,
  ap: (f: Functor) => Functor,
  chain: (f: Fn) => Functor,
  fold: (...x: Fn[]) => any,
}