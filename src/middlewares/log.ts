import { Stage, PatchFn, TopoData } from "../../typings/defines";

// Example for middleware that show how to log patch behavior
export const log = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log("before log");

  next(userState);

  console.log("after log");
}
