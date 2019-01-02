
// export type Creator = (x: any) => ( Functor & ApplicativeFunctor & Monad & Monoid );
export type Fn = (x: any) => any;

export interface Functor {
  value: any;
  map: <T extends Functor>(f: Fn) => T;
  join: <T>() => T,
}

export interface EitherFunctor extends Functor {
  fold: <T>(f: Fn, g: Fn) => T;
}

export interface ApplicativeFunctor extends Functor {
  ap: (f: Functor) => ApplicativeFunctor;
}

export interface Monoid extends Functor {
  // id: (x: Monoid) => Monoid
}

export interface Monad extends Monoid {
  chain: (f: Fn) => Monad;
  join: <T>() => T;
}
