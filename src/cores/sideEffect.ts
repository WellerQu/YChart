const sideEffect = (f: Function) => ({
  __value__: f,
  map: (g: Function) => sideEffect(() => g(f())),
  fold: (g: Function) => g(f()),
});

sideEffect.of = (f: Function) => sideEffect(f);

export default sideEffect;