import { Creator, MapFunction, Functor, } from '../../typings/functors';

export const left = <Creator>((x: any) => ({
  value: x,
  map: (f: MapFunction) => left(x),
  chain: (f: MapFunction) => left(x),
  ap: (f: Functor) => f.map(x),
}));

left.of = (x: any) => left(x);

export const right = <Creator>((x: any) => ({
  value: x,
  map: (f: MapFunction) => right(f(x)),
  chain: (f: MapFunction) => f(x),
  ap: (f: Functor) => f.map(x),
}));

right.of = (x: any) => right(x);