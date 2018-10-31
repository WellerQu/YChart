/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

import { ComponentFn, StrategyFn, LineOption, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import compose from '../compose';
import { createGroup, createArrow, createLine, } from './components';

const createCallLine: ComponentFn<LineOption> = (option: LineOption): StrategyFn => (
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
