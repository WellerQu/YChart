import { VNode, } from 'snabbdom/vnode';
import { ServiceOption, } from '../cores/core';
import functor from '../cores/functor';
import { appendTo, group, circle, text, } from './components';
import id from '../cores/id';
import { NODE_TYPE, } from '../constants/constants';

const service = (option: ServiceOption) => 
  functor(option)
    .map(( option: ServiceOption ) => [
      circle({ x: 35 + 15, y: 35 + 24, radius: 25, fill: '#FFFFFF', }),
      circle({ x: 35 + 15, y: 35 + 24, radius: 25, fill: option.fill, }),
      circle({ x: 35 + 15, y: 35 + 24, radius: 20, fill: '#FFFFFF', }),
      circle({ x: 5 + 15, y: 45 + 24, radius: 15, fill: '#338CFF',}),
      text({ content: option.type, x: 5 + 15, y: 46.5 + 24,}),
      text({ content: `${option.activeInstanceCount}/${option.instanceCount}`, x: 35 + 15, y: 37 + 24, }),
      text({ content: option.title, x: 35 + 15, y: 80 + 24,}),
    ])
    .map((nodes: VNode[]) => group({ 
      id: option.id, 
      x: 0, y: 0, 
      className: { [NODE_TYPE.SERVER]: true, [NODE_TYPE.NODE]: true, }, }, nodes))
    .map(appendTo)
    .fold(id);

service.of = (option: ServiceOption) => service(option);

export default service;