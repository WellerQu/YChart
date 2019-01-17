/**
 * @module components
 */

import { VNode, } from '../../node_modules/snabbdom/vnode';
import { Component, Strategy, AppNodeOption, } from '../../typings/defines';
import compose from '../compose';
import { createText, createCircle, createGroup, } from './__components';
import { isNull, } from '../utils';

const identity = (a: any) => a;

const createAppNode:Component<AppNodeOption> = (option: AppNodeOption): Strategy => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({ content: option.title, x: 35 + 15, y: 90 + 24, className: 'title', }),
    createText({ content: '业务域', x: 35 + 15, y: 35 + 24, className: 'type',}),
    !isNull(option.instances)
      ? createText({ content: `${option.instances} 服务实例`, x: 82 + 15, y: 48 + 24, className: 'epm', })
      : identity,
    !isNull(option.tierCount)
      ? createText({ content: `${option.tierCount} 服务`, x: 82 + 15, y: 36 + 24, className: 'rpm', })
      : identity,
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 30, fill: '#CC99CC', className: 'response', }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 32, fill: '#FFF', }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 35, fill: '#CC99CC', className: 'response', }),
    createCircle({ cx: 35 + 15, cy: 35 + 24, radius: 35, fill: 'white', }),
    createGroup
  );

  parentNode.children.push(createNode({ className: option.className, id: option.id, }));

  return parentNode;
};

export default createAppNode;