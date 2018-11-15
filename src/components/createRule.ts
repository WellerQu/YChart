/**
 * @module components
 */

import { Component, RuleOption, Strategy, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';
import { h, } from 'snabbdom';
import compose from '../compose';
import { createText, } from './components';
import { RULE_PADDING, } from '../constants/constants';

export const createRule: Component<RuleOption> = (option: RuleOption):Strategy => (parentNode: VNode) => {
  const texts: Strategy[] = [];
  const actions: string[] = [];
  const availableWidth = option.availableWidth - 2 * RULE_PADDING;

  let current = RULE_PADDING;
  let stepCount = 0;

  while (current <= availableWidth + RULE_PADDING) {
    actions.push(`M${current},1 V5`);
    texts.push(createText({
      content: `${(stepCount++) * option.step}`,
      x: current,
      y: 25,
      className: 'calibration',
    }));
    current += (availableWidth * option.step / (option.max));
  }

  parentNode.children.push(
    h('path', {
      attrs: {
        d: `M${RULE_PADDING},1 H${availableWidth + RULE_PADDING} ${actions.join(' ')}`,
        fill: 'none',
        stroke: option.color || '#CCC',
        'stroke-width': 1,
      },
      ns: 'http://www.w3.org/2000/svg',
    })
  );

  return compose<VNode>(...texts)(parentNode);
};