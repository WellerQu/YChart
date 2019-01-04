import { MapFunction, Functor, Creator, } from '../../typings/functors';

const id = (x: any) => x;

const curry = (f: Function) => {
  const params: any[] = [];
  const computed = (...args: any[]) => {
    params.push.apply(params, args);

    if (params.length > f.length)
      return f(...args);

    return computed;
  };

  return computed;
};

type EffectFunction = (reject: Function, resolve: Function) => void;

interface EffectFunctor extends Functor {
  fold: (f: MapFunction, g: MapFunction) => void;
}

const effect = ((f: EffectFunction) => ({
  value: f,
  map: (g: MapFunction) => effect((h: MapFunction, i: MapFunction) => f((err: any) => h(err), (res: any) => i(g(res)))),
  fold: (g = id, h = id) => f(g, h),
  ap: (g: Functor) => g.map(curry(f)),
  chain: (g: MapFunction) => g(f).value,
}));

// effect.of = (f: EffectFunction) => effect(f);

export default effect;