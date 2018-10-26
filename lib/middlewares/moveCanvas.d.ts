import { Stage, PatchFn, TopoData } from '../../typings/defines';
export declare const moveCanvas: (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => void;
