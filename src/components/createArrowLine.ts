/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module components
 */

import { VNode, } from 'snabbdom/vnode';
import { ArrowLineOption, Component, Strategy, } from '../../typings/defines';
import compose from '../compose';
import { createText, createArrow, createLine, createGroup, } from './__components';

/**
 * 复合组件 - 组合了箭头, 文本, 线段的组件, 创建了一个用于穿件复合组件的策略函数, 该函数将会创建一个VNode
 * @param option 线段配置
 * @returns
 */
const createArrowLine: Component<ArrowLineOption> = (option: ArrowLineOption): Strategy => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({
      content: option.text || '',
      className: 'line-desc',
      x: 0,
      y: 0,
    }),
    createArrow({
      x: 0,
      y: 0,
      id: option.id,
      fill: option.fill,
    }),
    createLine({
      id: option.id,
      x1: option.x1,
      y1: option.y1,
      x2: option.x2,
      y2: option.y2,
      strokeColor: option.strokeColor,
      strokeWidth: option.strokeWidth,
    }),
    createGroup
  );

  parentNode.children.push(createNode({ className: option.className, id: option.id, }));

  return parentNode;
};

export default createArrowLine;