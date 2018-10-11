import { VNode } from "../../node_modules/snabbdom/vnode";

import { ServiceNodeOption } from "../../typings/defines";

import { component } from "./components";

import compose from "../compose";

const { createText, createCircle, createGroup } = component;

export const createServiceNode = (option: ServiceNodeOption) => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({ content: option.title, x: 35, y: 90, tag: "title" }),
    createText({ content: option.rpm, x: 82, y: 48, tag: "rpm" }),
    createText({ content: option.avgRT, x: 82, y: 36, tag: "avgRT" }),
    createText({ content: option.instances, x: 35, y: 35, tag: "instances" }),
    createText({ content: option.type, x: 0, y: 60, tag: "type" }),
    createCircle({ cx: 0, cy: 55, radius: 15, fill: "#338cff", tag: "type" }),
    createCircle({ cx: 35, cy: 35, radius: 22, fill: "white" }),
    createCircle({
      cx: 35,
      cy: 35,
      radius: 35,
      fill: option.color,
      tag: "health"
    }),
    createGroup
  );

  parentNode.children.push(createNode({ className: option.tag }));

  return parentNode;
};