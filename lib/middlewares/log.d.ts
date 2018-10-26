import { Stage, PatchFn, TopoData } from '../../typings/defines';
export declare const log: (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => void;
