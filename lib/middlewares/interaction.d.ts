import { Stage, PatchFn, TopoData } from '../../typings/defines';
export declare const interaction: (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => void;
