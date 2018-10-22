import { VNode } from "../../node_modules/snabbdom/vnode";
import { NODE_SIZE } from "../constants";
import { ImageNodeOption } from '../../typings/defines';

import compose from "../compose";
import { createText, createImage, createGroup } from "./components";

const IMAGE_SIZE = 50; // both width and height

const createImageNode = (option: ImageNodeOption) => (parentNode: VNode) => {
  const { title, URL, tag } = option;
  const createNode = compose<VNode>(
    createText({
      content: title,
      x: 70,
      y: (NODE_SIZE - IMAGE_SIZE) / 2 + IMAGE_SIZE + 20,
      tag: "title"
    }),
    createImage({
      URL,
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      x: (NODE_SIZE - IMAGE_SIZE) / 2,
      y: (NODE_SIZE - IMAGE_SIZE) / 2,
    }),
    createGroup
  );

  parentNode.children.push(createNode({ className: tag, id: option.id }));

  return parentNode;
};

export default createImageNode;