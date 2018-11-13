import { ImageNodeOption, Node, } from '../../typings/defines';
import { NODE_TYPE, } from '../NODE_TYPE';
import { imagePath, } from '../utils';

/**
 * 将Node实例转换为ImageNodeOption实例
 * @memberof Adapters
 * @param node Node实例
 * @returns ImageNodeOption实例
 */
export default function createImageNodeOption (node: Node): ImageNodeOption {
  return {
    URL: imagePath(node.showIcon.toLowerCase()),
    title: node.showName,
    className: `${node.type} ${NODE_TYPE.NODE}`,
    id: node.id,
  };
}