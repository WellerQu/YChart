const asyncSideEffect = (f: Function) => ({
  __value__: f,
  map: (g: Function) => asyncSideEffect((h: Function, i: Function) => f((err: any) => h(err), (res: any) => i(g(res)))),
  fold: (g: Function, h: Function) => f(g, h),
});

asyncSideEffect.of = (f: Function) => asyncSideEffect(f);

export default asyncSideEffect;