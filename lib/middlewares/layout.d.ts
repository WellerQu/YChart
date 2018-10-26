import { Stage, PatchFn, TopoData } from '../../typings/defines';
export declare const layout: (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => void;
