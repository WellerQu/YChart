/**
 * @module instances
 */

import createInstance from '../src/cores/createInstance';
import applyMiddlewares from '../src/cores/applyMiddlewares';
import log from '../src/middlewares/log';

import functor from './cores/functor';
import id from './cores/id';

const withMiddlewares = applyMiddlewares(
  log,
);

const instance = functor({
  size: { width: 1200, height: 400, },
  viewbox: null,
  container: document.querySelector('#stack'),
})
  .map(createInstance)
  .map(withMiddlewares)
  .fold(id);

const render = () => instance.patch();

export {
  render
};