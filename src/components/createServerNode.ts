import { VNode } from "../../node_modules/snabbdom/vnode";

import { ServerNodeOption } from "../../typings/defines";

import { component } from "./components";

import compose from "../compose";

const { createText, createCircle, createGroup } = component;

export const createServerNode = (option: ServerNodeOption) => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({ content: option.title, y: 70, }),
    createText({ content: option.instances, y: 24, }),
    createCircle({ cx: 35, cy: 35, radius: 22, fill: "white", }),
    createCircle({ cx: 35, cy: 35, radius: 35, fill: option.color, }),
    createGroup,
  );
  
  parentNode.children.push(createNode({ className: option.tag }));

  return parentNode;
};