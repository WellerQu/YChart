import { VNode, } from 'snabbdom/vnode';
import { ServiceOption, } from '../cores/core';
import functor from '../cores/functor';
import { appendTo, group, circle, text, } from './components';
import id from '../cores/id';
import { NODE_TYPE, } from '../constants/constants';

const service = (option: ServiceOption) => 
  functor(option)
    .map(( option: ServiceOption ) => [
      circle({ x: 70, y: 70, radius: 25, fill: '#FFFFFF', }),
      circle({ x: 70, y: 70, radius: 25, fill: option.fill, }),
      circle({ x: 70, y: 70, radius: 20, fill: '#FFFFFF', }),
      circle({ x: 40, y: 80, radius: 15, fill: '#338CFF',}),
      text({ content: option.type, x: 40, y: 80.5, className: { 'type-name': true, }, }),
      text({ content: `${option.activeInstanceCount}/${option.instanceCount}`, x: 70, y: 70.5, className: { 'instance-count': true, }, }),
      text({ content: option.title, x: 70, y: 110, className: { 'node-name': true, }, }),
    ])
    .map((nodes: VNode[]) => group({ 
      id: option.id, 
      x: 0, y: 0, 
      className: { [NODE_TYPE.SERVER]: true, [NODE_TYPE.NODE]: true, }, }, nodes))
    .map(appendTo)
    .fold(id);

service.of = (option: ServiceOption) => service(option);

export default service;