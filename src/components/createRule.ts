/**
 * @module components
 */

import { Component, RuleOption, Strategy, } from '../@types';
import { VNode, } from 'snabbdom/vnode';
import { h, } from 'snabbdom';
import compose from '../compose';
import { createText, } from './components';
import { RULE_PADDING, TEXT_AREA_WIDTH, } from '../constants/constants';


export const createRule: Component<RuleOption> = (option: RuleOption):Strategy => (parentNode: VNode) => {
  const texts: Strategy[] = [];
  const actions: string[] = [];
  const availableWidth = option.availableWidth - 2 * RULE_PADDING - 10;

  let current = RULE_PADDING;
  let stepCount = 0;

  while (current <= availableWidth + RULE_PADDING) {
    actions.push(`M${current + TEXT_AREA_WIDTH},10 V15`);
    texts.push(createText({
      content: `${(stepCount++) * option.step} ms`,
      x: current + TEXT_AREA_WIDTH,
      y: 25,
      className: 'calibration',
    }));
    current += (availableWidth * option.step / (option.max));
  }

  parentNode.children.push(
    h('path', {
      attrs: {
        d: `M${RULE_PADDING + TEXT_AREA_WIDTH},10 H${availableWidth + RULE_PADDING} ${actions.join(' ')}`,
        fill: 'none',
        stroke: option.color || '#CCC',
        'stroke-width': 1,
      },
      ns: 'http://www.w3.org/2000/svg',
    })
  );

  return compose<VNode>(...texts)(parentNode);
};