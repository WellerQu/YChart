/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />

/**
 * @module components
 */

import { CallstackOption, Component, Strategy, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import compose from '../compose';
import { createText, createGroup, createRect, } from './components';
import { CALLSTACK_HEIGHT, RULE_PADDING, } from '../constants/constants';

const createCallstack: Component<CallstackOption> = (option: CallstackOption): Strategy => (
  parentNode: VNode
) => {
  const textOption = {
    content: option.text || '',
    className: 'callstack-desc',
    x: RULE_PADDING + 10,
    y: 8,
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