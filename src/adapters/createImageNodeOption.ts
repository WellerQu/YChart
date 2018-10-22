import { ImageNodeOption, Node } from '../../typings/defines';

export default function createImageNodeOption(node: Node): ImageNodeOption {
  return {
    URL: `${node.showIcon.toLowerCase()}.png`,
    title: node.showName,
    tag: `${node.type} node`,
    id: node.id,
  };
}