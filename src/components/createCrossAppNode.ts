import { VNode, } from '../../node_modules/snabbdom/vnode';
import { ServiceNodeOption, Component, Strategy, } from '../../typings/defines';
import compose from '../compose';
import { createText, createCircle, createGroup, } from './components';

const createCrossAppNode:Component<ServiceNodeOption> = (option: ServiceNodeOption): Strategy => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({ content: option.title, x: 35 + 15, y: 90 + 24, className: 'title', }),
    createText({ content: option.type, x: 0 + 15, y: 59 + 24, className: 'type', }),
    createCircle({ cx: 0 + 15, cy: 55 + 24, radius: 15, fill: '#338cff', className: 'type', }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 22, fill: 'white', }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 35, fill: '#DDD', className: 'health', }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 35, fill: 'white', }),
    createGroup
  );

  parentNode.children.push(createNode({ className: option.className, id: option.id, }));

  return parentNode;
};

export default createCrossAppNode;
