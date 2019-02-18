import { UserOption, Node, } from '../cores/core';
import imageNode from './imageNode';
import { VNode, } from 'snabbdom/vnode';
import { appendTo, group, } from './components';
import id from '../cores/id';
import { NODE_TYPE, } from '../constants/constants';

const user = (option: UserOption) => imageNode({
  ...option,
  URL: `${(option as Node).showIcon.toLowerCase()}.png`,
  title: `${(option as Node).showName}`,
})
  .map((nodes: VNode[]) => group({ 
    id: option.id, 
    x: 0, y: 0, 
    className: { [NODE_TYPE.USER]: true, [NODE_TYPE.NODE]: true, }, }, nodes))
  .map(appendTo)
  .fold(id);
;

user.of = (option: UserOption) => user(option);

export default user;