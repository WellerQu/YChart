import chai from 'chai';

import functor from '../../src/functors/functor';
import { Functor, } from '../../typings/functors';

describe('test functor', () => {
  it('map:single', () => {
    chai.expect(functor(123).map(x => x + 1).value).to.eq(124);
  });

  it('map:more than once', () => {
    chai.expect(functor(123).map(x => x + 1).map(x => x - 1).value).to.eq(123);
  });

  it('ap', () => {
    const add = (x: number) => (y: number) => x + y;
    chai.expect(functor(add).ap(functor(2)).ap(functor(2)).value).to.eq(4);
  });

  it('chain', () => {
    chai.expect(functor(4).map(x => functor(x)).fold(x => x).fold((x: any) => x)).to.eq(4);
    chai.expect(functor(4).chain(x => functor(x)).fold(x => x)).to.eq(4);
  });
});