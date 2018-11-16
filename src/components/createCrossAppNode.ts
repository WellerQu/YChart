/**
 * @module components
 */

import { VNode, } from '../../node_modules/snabbdom/vnode';
import { ServiceNodeOption, Component, Strategy, } from '../../typings/defines';
import compose from '../compose';
import { createText, createCircle, createGroup, } from './components';

/**
 * 复合组件 - 组合了圆环, 文本的组件, 类似于拓扑图的Service节点组件, 区别是不会显示实例数等信息. 
 * 同样, 创建了一个用于穿件跨应用节点的策略函数, 该函数将会创建VNode
 * @param option 跨应用节点配置
 * @returns
 */
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
