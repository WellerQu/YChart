import { right, left, } from './either';

const tryCatch = (x: Function) => {
  try {
    return right(x());
  } catch(e) {
    return left(e);
  }
};

export default tryCatch;