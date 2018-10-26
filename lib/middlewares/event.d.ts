import { Stage, PatchFn, TopoData, EventOption } from '../../typings/defines';
export declare const event: (options: EventOption) => (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => void;
