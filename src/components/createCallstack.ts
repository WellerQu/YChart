/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

import { CallstackOption, ComponentFn, StrategyFn, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import compose from '../compose';
import { createText, createGroup, createRect, } from './components';
import { CALLSTACK_HEIGHT, RULE_PADDING, } from '../constants';

const createCallstack: ComponentFn<CallstackOption> = (option: CallstackOption): StrategyFn => (
  parentNode: VNode
) => {
  const textOption = {
    content: option.text || '',
    className: 'callstack-desc',
    x: RULE_PADDING + 10,
    y: 18,
  };
  const createNode = compose<VNode>(
    createText(textOption), 
    createText(textOption), 
    createRect({
      x: RULE_PADDING,
      height: CALLSTACK_HEIGHT,
      width: option.width,
      fill: option.color,
      stroke: option.color,
      strokeWidth: 1,
    }),
    createGroup
  );

  parentNode.children.push(createNode({ className: option.className, id: option.id, x: option.paddingLeft, }));

  return parentNode;
};

export default createCallstack;