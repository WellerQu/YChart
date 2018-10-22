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
      x: option.x1,
      y: option.y1,
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

  parentNode.children.push(createNode({ className: option.className, id: option.id }));

  return parentNode;
};

export default createArrowLine;