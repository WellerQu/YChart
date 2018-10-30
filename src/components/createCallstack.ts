/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

import { CallstackOption, ComponentFn, StrategyFn } from '../../typings/defines';
import { VNode } from 'snabbdom/vnode';
import compose from '../compose';
import { createText, createGroup, createRect } from './components';
import { CALLSTACK_HEIGHT } from '../constants';

const createCallstack: ComponentFn<CallstackOption> = (option: CallstackOption): StrategyFn => (
  parentNode: VNode
) => {
  const createNode = compose<VNode>(
    createText({
      content: option.text || '',
      className: 'callstack-desc',
      x: 0,
      y: 0,
    }), 
    createRect({
      height: CALLSTACK_HEIGHT,
      width: option.width,
      fill: option.color,
      stroke: option.color,
      strokeWidth: 1,
    }),
    createGroup);

  parentNode.children.push(createNode({ className: option.className, id: option.id, }));

  return parentNode;
};

export default createCallstack;