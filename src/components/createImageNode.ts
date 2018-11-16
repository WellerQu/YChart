/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module components
 */

import { VNode, } from 'snabbdom/vnode';
import { NODE_SIZE, } from '../constants/constants';
import { ImageNodeOption, Component, Strategy, } from '../../typings/defines';

import compose from '../compose';
import { createText, createImage, createGroup, } from './components';

const IMAGE_SIZE = 50; // both width and height

/**
 * 复合组件 - 组合了图片和文本的组件, 创建了一个用于创建图像节点的策略函数, 该函数将创建一个VNode
 * @param option 图像节点配置
 * @returns
 */
const createImageNode: Component<ImageNodeOption> = (option: ImageNodeOption): Strategy => (parentNode: VNode) => {
  const { title, URL, className, id, } = option;

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

  parentNode.children.push(createNode({ className: className, id: id, }));

  return parentNode;
};

export default createImageNode;