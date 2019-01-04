import { expect,} from 'chai';

import functor from '../../src/functors/functor';


describe('test functor', () => {
  /*
   * Functor:
   * 提供接口往里面塞值：Functor.of = x => Functor(x)
   * 单元律：a.map(x => x) === a
   * 保存原有数据结构（可组合）：a.map(x => f(g(x))) === a.map(g).map(f), a.map(id) === id(a) where id = x => x
   */

  // 当两个函子的value相等时, 视为两个函子相等: 若f(x) === g(x)成立, 则f = g

  it('of', () => {
    expect(functor.of).be.not.undefined;
    expect(functor(2).value).to.eq(functor.of(2).value);
  });

  it('map', () => {
    expect(functor(2).map).be.not.undefined;

    const id = (x: any) => x;

    expect(functor(2).map(id).value).to.eq(functor(2).value);

    const f = (x: number) => x + 1;
    const g = (x: number) => x + 2;

    expect(functor(2).map((x: number) => f(g(x))).value).to.eq(functor(2).map(f).map(g).value);
    expect(functor(2).map(id).value).to.eq(id(functor(2)).value);
  });

  /*
   * Applicative:
   * Identity: A.of(x => x).ap(v) === v
   * Homomorphism: A.of(f).ap(A.of(x)) === A.of(f(x))
   * Interchange: u.ap(A.of(y)) === A.of(f => f(y)).ap(u)
   */
  it('ap', () => {
    expect(functor.of(4).ap).be.not.undefined;

    const id = (x: any) => x;

    expect(functor.of(id).ap(functor(4)).value).to.eq(functor(4).value);

    const f = (x: number) => x + 1;

    expect(functor.of(f).ap(functor.of(4)).value).to.eq(functor.of(f(4)).value);
    expect(functor(f).ap(functor(4)).value).to.eq(functor((f: (x: number) => number) => f(4)).ap(functor(f)).value);
  });

  /*
   * Monad:
   * Left identity: M.of(a).chain(f) === f(a)
   * Right identity: m.chain(M.of) === m
   * Associativity: m.chain(f).chain(g) === m.chain(x => f(x).chain(g))
   */
  it('chain', () => {
    expect(functor.of(4).chain).be.not.undefined;

    const f = (x: number) => functor(x + 1);

    expect(functor.of(1).chain(f).value).to.eq(f(1).value);
    expect(functor.of(3).chain(functor.of).value).to.eq(functor(3).value);

    const g = (x: number) => functor(x - 1);

    expect(functor.of(3).chain(f).chain(g).value).to.eq(functor(3).chain(x => f(x).chain(g)).value);
  });
});