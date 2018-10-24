import { Stage, PatchFn, TopoData } from '../../typings/defines';

export const moveNode = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log('before moveNode');

  next(userState);

  console.log('after moveNode');
};

