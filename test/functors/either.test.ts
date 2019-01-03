import chai from 'chai';
import sinon from 'sinon';

import functor from '../../src/functors/functor';
import { left, right, } from '../../src/functors/either';

describe('test left of either', () => {
  it('map', () => {
    chai.expect(left(123).map(x => x + 1).value).to.eq(123);
  });

  it('fold', () => {
    const error = sinon.spy();
    const handle = sinon.spy();

    left('an error').fold(error, handle);

    chai.expect(error.calledOnce).to.be.true;
    chai.expect(handle.notCalled).to.be.true;

    chai.expect(error.lastCall.args[0]).to.eq('an error');
  });

  it('map & fold', () => {
    const error = sinon.spy();
    const handle = sinon.spy();

    left('an error').map(x => `${x} occurred`).fold(error, handle);

    chai.expect(error.calledOnce).to.be.true;
    chai.expect(handle.notCalled).to.be.true;

    chai.expect(error.lastCall.args[0]).to.eq('an error');
  });
});

describe('test right of either', () => {
  it('map', () => {
    chai.expect(right(123).map(x => x + 1).value).to.eq(124);
  });

  it('fold', () => {
    const error = sinon.spy();
    const handle = sinon.spy();

    right('a result').fold(error, handle);

    chai.expect(error.notCalled).to.be.true;
    chai.expect(handle.calledOnce).to.be.true;

    chai.expect(handle.lastCall.args[0]).to.eq('a result');
  });

  it('map & fold', () => {
    const error = sinon.spy();
    const handle = sinon.spy();

    right('a result').map(x => `${x} has came`).fold(error, handle);

    chai.expect(error.notCalled).to.be.true;
    chai.expect(handle.calledOnce).to.be.true;

    chai.expect(handle.lastCall.args[0]).to.eq('a result has came');
  });
});

describe('test either', () => {
  const responseIsNotNull = (x: any) => (x !== null ? right(x) : left('response is empty'));
  const responseIsOK = (x: any) => (x.code === 0 ? right(x.data) : left(x.message));

  it('response is empty', () => {
    const error = sinon.spy();
    const handle = sinon.spy();

    functor(null)
      .chain(responseIsNotNull)
      .chain(responseIsOK)
      .map(x => `Hello ${x}`)
      .map(x => `${x}, my friend`)
      .fold(error, handle);

    chai.expect(error.calledOnce).to.be.true;
    chai.expect(handle.notCalled).to.be.true;

    chai.expect(error.lastCall.args[0]).to.eq('response is empty');
  });

  it('response is OK', () => {
    const error = sinon.spy();
    const handle = sinon.spy();

    functor({ code: 0, data: 'Nix', message: '', })
      .chain(responseIsNotNull)
      .chain(responseIsOK)
      .map(x => `Hello ${x}`)
      .map(x => `${x}, my friend`)
      .fold(error, handle);

    chai.expect(error.notCalled).to.be.true;
    chai.expect(handle.calledOnce).to.be.true;

    chai.expect(handle.lastCall.args[0]).to.eq('Hello Nix, my friend');
  });

  it('response is bad', () => {
    const error = sinon.spy();
    const handle = sinon.spy();

    functor({ code: 404, data: '', message: 'something wrong',})
      .chain(responseIsNotNull)
      .chain(responseIsOK)
      .map(x => `Hello ${x}`)
      .map(x => `${x}, my friend`)
      .fold(error, handle);

    chai.expect(error.calledOnce).to.be.true;
    chai.expect(handle.notCalled).to.be.true;

    chai.expect(error.lastCall.args[0]).to.eq('something wrong');
  });
});