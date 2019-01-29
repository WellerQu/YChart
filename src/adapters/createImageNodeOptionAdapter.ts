/**
 * @module adapters
 */

import { ImageNodeOption, Node, } from '../@types';
import { imagePath, } from '../utils';
import { NODE_TYPE, } from '../constants/constants';

/**
 * 将Node实例转换为ImageNodeOption实例
 * @memberof adapters
 * @param node Node实例
 * @returns
 */
export default function createImageNodeOption (node: Node): ImageNodeOption {
  return {
    URL: imagePath(node.showIcon.toLowerCase()),
    title: node.showName,
    className: `${node.type} ${NODE_TYPE.NODE}`,
    id: node.id,
  };
}