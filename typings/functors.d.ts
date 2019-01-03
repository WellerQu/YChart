export type Fn = (...x: any[]) => any;

export interface Functor {
  readonly value: any;
  map: (f: Fn) => Functor;
  ap: (f: Functor) => Functor,
  chain: (f: Fn) => Functor,
  fold: (...x: Fn[]) => any,
}
