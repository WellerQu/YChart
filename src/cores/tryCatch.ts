import right from './right';
import left from './left';

const tryCatch = (f: Function) => {
  try {
    return right(f());
  } catch (error) {
    return left(error);
  }
};

export default tryCatch;