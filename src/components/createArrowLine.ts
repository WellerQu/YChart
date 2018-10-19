import { VNode } from '../../node_modules/snabbdom/vnode';

import { ArrowLineOption } from '../../typings/defines';

import compose from '../compose';

import { createText, createArrow, createLine, createGroup } from './components';

const createArrowLine = (option: ArrowLineOption) => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({ content: option.text || '' }),
    createArrow({
      id: option.id,
      x: option.x,
      y: option.y,
      fill: option.fill,
      tag: option.tag
    }),
    createLine({
      id: option.id,
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

  parentNode.children.push(createNode({ className: option.tag, id: option.id }));

  return parentNode;
};

export default createArrowLine;