import { Stage, PatchFn, TopoData } from '../../typings/defines';
export declare const moveNode: (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => void;
