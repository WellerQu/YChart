import chai from 'chai';
import sinon from 'sinon';

import effect from '../../src/functors/effect';
import functor from '../../src/functors/functor';

describe('test effect', () => {
  it('map:rejected', (done) => {
    const mapHandler1 = sinon.spy();
    const mapHandler2 = sinon.spy();
    const errorHandler = sinon.spy();
    const handler = sinon.spy();
    const t1 = effect((reject, resolve) => setTimeout(() => (reject('something wrong'), done())));

    t1.map(mapHandler1).map(mapHandler2).fold(errorHandler, handler);

    chai.expect(mapHandler1.notCalled).to.be.true;
    chai.expect(mapHandler2.notCalled).to.be.true;
    chai.expect(errorHandler.calledOnceWith('something wrong'));
    chai.expect(handler.notCalled);
  });

  it('map(just once):resolved', (done) => {
    const res = { code: 1, user: { name: 'Jessica', }, };
    const errorHander = sinon.spy();
    const handler = sinon.spy();
    const t1 = effect((reject, resolve) => setTimeout(() => (resolve(res), done())));

    t1.map(res => res.user).fold(errorHander, handler);

    chai.expect(errorHander.notCalled).to.be.true;
    chai.expect(handler.calledOnceWith(res.user));
  });

  it('map(more than once):resolved', (done) => {
    const res = { code: 1, user: { name: 'Jessica', }, };
    const errorHander = sinon.spy();
    const handler = sinon.spy();
    const t1 = effect((reject, resolve) => setTimeout(() => (resolve(res), done())));

    t1.map(res => res.user).map(user => user.name).map(name => `I love u, ${name}`).fold(errorHander, handler);

    chai.expect(errorHander.notCalled).to.be.true;
    chai.expect(handler.calledOnceWith('I love u, Jessica'));
  });

  it('ap', () => {
    const handler = sinon.spy();
    const t1 = effect((x: number) => (y: number) => x + y);

    t1.ap(functor(1)).ap(functor(2)).fold(handler);

    chai.expect(handler.calledOnceWith(3));
  });

  it('chain', () => {
    const id = (x: number) => x + 1;
    chai.expect(effect(id).chain(x => functor(x)).fold(x => x)(1)).to.eq(2);
  });

  it('fold', () => {
    const handler = sinon.spy();

    effect(x => x(1)).fold(handler);

    chai.expect(handler.calledOnceWith(1));
  });
});