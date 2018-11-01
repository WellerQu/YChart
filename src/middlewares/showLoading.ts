import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';

// Show a loading in graph center if there's not anything
export const loading = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {

  next(userState);
};

