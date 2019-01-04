export type MapFunction = (x: any) => any;

declare interface Creator<T extends Functor> {
  (x: any): T;
  of: (x: any) => T;
}

declare interface Functor {
  readonly value: any;
  map: (f: MapFunction) => Functor;
  ap: (a: Functor) => Functor;
  chain: (f: MapFunction) => Functor;
}
/*
 * Monad:
 * Left identity: M.of(a).chain(f) === f(a)
 * Right identity: m.chain(M.of) === m
 * Associativity: m.chain(f).chain(g) === m.chain(x => f(x).chain(g))
 */

/*
 * Monoid:
 * 它是一个集合 S
 * S 的元素之间有一个二元运算 x，运算的结果也属于 S：S a x S b --> S c
 * 存在一个特殊元素 e，使得 S 中的任意元素与 e 运算，都返回此元素本身：S e x S m --> S m
 */