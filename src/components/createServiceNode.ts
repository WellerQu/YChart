import { VNode } from '../../node_modules/snabbdom/vnode';

import { ServiceNodeOption } from '../../typings/defines';

import compose from '../compose';

import { createText, createCircle, createGroup } from './components';

const createServiceNode = (option: ServiceNodeOption) => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({ content: option.title, x: 35 + 15, y: 90 + 24, tag: 'title' }),
    createText({ content: option.rpm.toString(), x: 82 + 15, y: 48 + 24, tag: 'rpm' }),
    createText({ content: option.avgRT.toString(), x: 82 + 15, y: 36 + 24, tag: 'avgRT' }),
    createText({ content: option.instances, x: 35 + 15, y: 37 + 24, tag: 'instances' }),
    createText({ content: option.type, x: 0 + 15, y: 59 + 24, tag: 'type' }),
    createCircle({ cx: 0 + 15, cy: 55 + 24, radius: 15, fill: '#338cff', tag: 'type' }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 22, fill: 'white' }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 35, fill: option.color, tag: 'health' }),
    createGroup
  );

  parentNode.children.push(createNode({ className: option.tag, id: option.id }));

  return parentNode;
};

export default createServiceNode;