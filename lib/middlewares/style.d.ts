import { Stage, PatchFn, TopoData } from '../../typings/defines';
export declare const style: (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => void;
