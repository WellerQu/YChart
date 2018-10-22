import { VNode } from '../../node_modules/snabbdom/vnode';

import { ServiceNodeOption } from '../../typings/defines';

import compose from '../compose';

import { createText, createCircle, createGroup } from './components';

const createServiceNode = (option: ServiceNodeOption) => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({ content: option.title, x: 35 + 15, y: 90 + 24, className: 'title' }),
    createText({ content: `${option.epm} epm`, x: 82 + 15, y: 60 + 24, className: 'epm' }),
    createText({ content: `${option.rpm} rpm`, x: 82 + 15, y: 48 + 24, className: 'rpm' }),
    createText({ content: `${option.avgRT} ms`, x: 82 + 15, y: 36 + 24, className: 'avgRT' }),
    createText({ content: option.instances, x: 35 + 15, y: 37 + 24, className: 'instances' }),
    createText({ content: option.type, x: 0 + 15, y: 59 + 24, className: 'type' }),
    createCircle({ cx: 0 + 15, cy: 55 + 24, radius: 15, fill: '#338cff', className: 'type' }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 22, fill: 'white' }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 35, fill: option.color, className: 'health' }),
    createGroup
  );

  parentNode.children.push(createNode({ className: option.className, id: option.id }));

  return parentNode;
};

export default createServiceNode;