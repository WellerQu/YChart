/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module components
 */

import { Component, Strategy, LineOption, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import compose from '../compose';
import { createGroup, createArrow, createLine, } from './__components';

/**
 * 复合组件 - 组合了箭头, 折线的组件, 创建一个用于创建调用关系连线的策略函数, 该函数将创建一个VNode
 * @param option 调用关系折线配置
 * @returns
 */
const createCallLine: Component<LineOption> = (option: LineOption): Strategy => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createArrow({
      x: option.x2,
      y: option.y2,
      id: option.id,
      fill: option.strokeColor,
    }),
    createLine(option),
    createGroup
  );

  parentNode.children.push(createNode({ className: option.className, id: option.id, }));

  return parentNode;
};

export default createCallLine;
