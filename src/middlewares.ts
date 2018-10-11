import { Stage, PatchFn, TopoData } from "../typings/defines";
import { VNode } from "../node_modules/snabbdom/vnode";
import { h } from "../node_modules/snabbdom/h";

// Example for middleware that show how to log patch behavior
export const log = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log("before log");

  next(userState);

  console.log("after log");
}

// Example for middleware that show how to add an event handler
export const event = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log("before add event");

  const target = stage.getStageNode().children.find((n: VNode) => n.sel === 'g');
  if (target as VNode) {
    (<VNode>target).data.on = {
      click: (event) => console.log(event),
    }
  }
  
  next(userState);

  console.log("after add event");
}

// Example for middleware that show how to layout all elements
export const layout = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  console.log("before layout");

  next(userState);

  console.log("after layout");
}

const styleSheet = `
/* <![CDATA[ */
g {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  font-size: 12px;
}

g text.instances {
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
  font-size: 16px;
}

g text.title, g text.type {
  text-anchor: middle;  /* 文本水平居中 */
}

g text.type {
  fill: white;
}
/* ]]> */
`;

export const style = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  stage.getStageNode().children.push(
    h("style", {ns: "http://www.w3.org/2000/svg"}, styleSheet)
  );

  next(userState);
}