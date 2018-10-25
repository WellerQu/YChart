import { ImageNodeOption, Node } from '../../typings/defines';
import { NODE_TYPE } from '../NODE_TYPE';

export default function createImageNodeOption(node: Node): ImageNodeOption {
  return {
    URL: `${node.showIcon.toLowerCase()}.png`,
    title: node.showName,
    className: `${node.type} ${NODE_TYPE.NODE}`,
    id: node.id,
  };
}