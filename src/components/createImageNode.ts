import { VNode } from '../../node_modules/snabbdom/vnode';
import { ImageNodeOption } from '../../typings/defines';

import compose from '../compose';
import { createText, createImage, createGroup } from './components';

export const createImageNode = (option: ImageNodeOption) => (
  parentNode: VNode
) => {
  const { title, URL, tag } = option;
  const createNode = compose<VNode>(
    createText({ content: title, x: 25, y: 70, tag: 'title' }),
    createImage({ URL, width: 50, height: 50 }),
    createGroup
  );

  parentNode.children.push(createNode({ className: tag }));

  return parentNode;
};
