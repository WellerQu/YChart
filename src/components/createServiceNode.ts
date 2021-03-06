/**
 * @module components
 */

import { VNode, } from '../../node_modules/snabbdom/vnode';
import { ServiceNodeOption, Component, Strategy, } from '../@types';
import compose from '../compose';
import { createText, createCircle, createGroup, } from './components';

const identity = (a: any) => a;
const isNumber = (a: any) => typeof a === 'number';

const createServiceNode:Component<ServiceNodeOption> = (option: ServiceNodeOption): Strategy => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({ content: option.title, x: 35 + 15, y: 80 + 24, className: 'title', }),
    isNumber(option.epm) ? 
      createText({ content: `${option.epm} epm`, x: 82 + 15, y: 60 + 24, className: 'epm', }) : identity,
    isNumber(option.errorCount) ? 
      createText({ content: `${option.errorCount} errors`, x: 82 + 15, y: 60 + 24, className: 'epm', }) : identity,
    isNumber(option.rpm) ? 
      createText({ content: `${option.rpm} rpm`, x: 82 + 15, y: 48 + 24, className: 'rpm', }) : identity,
    isNumber(option.callCount) ? 
      createText({ content: `${option.callCount} calls`, x: 82 + 15, y: 48 + 24, className: 'rpm', }) : identity,
    isNumber(option.elapsedTime) ? 
      createText({ content: `${option.elapsedTime} ms`, x: 82 + 15, y: 36 + 24, className: 'elapsedTime', }): identity,
    createText({ content: option.instances, x: 35 + 15, y: 37 + 24, className: 'instances', }),
    createText({ content: option.type, x: 5 + 15, y: 46.5 + 24, className: 'type', }),
    createCircle({ cx: 5 + 15, cy: 45 + 24, radius: 15, fill: '#338cff', className: 'type', }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 20, fill: 'white', }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 25, fill: option.color, className: 'health', }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 25, fill: 'white', }),
    createGroup
  );

  parentNode.children.push(createNode({ className: option.className, id: option.id, }));

  return parentNode;
};

export default createServiceNode;