import { VNode } from '../../node_modules/snabbdom/vnode';
import { NODE_SIZE } from '../constants';
import { ImageNodeOption } from '../../typings/defines';

import compose from '../compose';
import { createText, createImage, createGroup } from './components';

const IMAGE_SIZE = 50; // both width and height

const createImageNode = (option: ImageNodeOption) => (parentNode: VNode) => {
  const { title, URL, className, id } = option;

  const createNode = compose<VNode>(
    createText({
      content: title,
      x: NODE_SIZE / 2,
      y: (NODE_SIZE - IMAGE_SIZE) / 2 + IMAGE_SIZE + 20,
      className: 'title',
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

  parentNode.children.push(createNode({ className: className, id: id }));

  return parentNode;
};

export default createImageNode;