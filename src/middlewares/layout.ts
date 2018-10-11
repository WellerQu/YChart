import { Stage, PatchFn, TopoData } from "../../typings/defines";

// Example for middleware that show how to layout all elements
export const layout = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log("before layout");

  next(userState);

  console.log("after layout");
}
