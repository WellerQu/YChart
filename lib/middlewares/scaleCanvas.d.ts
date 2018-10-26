import { Stage, PatchFn, TopoData } from '../../typings/defines';
export declare const scaleCanvas: (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => void;
