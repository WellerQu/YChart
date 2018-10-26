import { Stage, PatchFn, TopoData } from '../../typings/defines';
export declare const grid: (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => void;
