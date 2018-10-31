import { ImageNodeOption, Node, } from '../../typings/defines';
import { NODE_TYPE, } from '../NODE_TYPE';
import { imagePath, } from '../utils';

export default function createImageNodeOption (node: Node): ImageNodeOption {
  return {
    URL: imagePath(node.showIcon.toLowerCase()),
    title: node.showName,
    className: `${node.type} ${NODE_TYPE.NODE}`,
    id: node.id,
  };
}