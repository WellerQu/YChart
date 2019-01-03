import { Fn, Functor, } from '../../typings/functors';
import functor from './functor';

const id = (x: any) => x;

const effect = (f: Fn): Functor => ({
  ...(functor(f)),
  value: f,
  map: (g: Fn) => effect((h: Fn, i: Fn) => f((err: string) => h(err), (res: any) => i(g(res)))),
  fold: (g = id, h = id) => f(g, h),
});

export default effect;