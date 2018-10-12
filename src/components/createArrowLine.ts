import { VNode } from '../../node_modules/snabbdom/vnode';

import { LineOption, ArrowOption } from '../../typings/defines';

import compose from '../compose';

import { createText, createArrow, createLine, createGroup } from './components';

export const createArrowLine = (option: LineOption & ArrowOption) => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({ content: '' }),
    createArrow({
      x: option.x,
      y: option.y,
      fill: option.fill,
      tag: option.tag
    }),
    createLine({
      x1: option.x1,
      y1: option.y1,
      x2: option.x2,
      y2: option.y2,
      strokeColor: option.strokeColor,
      strokeWidth: option.strokeWidth,
      tag: option.tag
    }),
    createGroup
  );

  parentNode.children.push(createNode({ className: option.tag }));

  return parentNode;
};
