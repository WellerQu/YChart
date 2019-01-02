export type Fn = (x: any) => any;

export interface Functor {
  value: any;
  map: (f: Fn) => Functor;
  join: <T>() => T,
  ap: (f: Functor) => Functor,
  chain: (f: Fn) => Functor,
  fold: (...x: Fn[]) => any,
}
