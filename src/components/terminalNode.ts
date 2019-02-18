import { UserOption, Node, } from '../cores/core';
import imageNode from './imageNode';
import { VNode, } from 'snabbdom/vnode';
import { appendTo, group, } from './components';
import id from '../cores/id';
import { NODE_TYPE, } from '../constants/constants';

const terminalNode = (option: Node) => imageNode({
  ...option,
  URL: `${option.showIcon.toLowerCase()}.png`,
  title: `${option.showName}`,
})
  .map((nodes: VNode[]) => group({ 
    id: option.id, 
    x: 0, y: 0, 
    className: { [option.smallType || option.type]: true, [NODE_TYPE.NODE]: true, },
  }, nodes))
  .map(appendTo)
  .fold(id);
;

terminalNode.of = (option: Node) => terminalNode(option);

export default terminalNode;