/**
 * @module adapters
 */

import { RULE_PADDING, } from '../constants/constants';
import { clamp, } from '../utils';
import { CallstackData, CallstackOption, } from '../@types';

/**
 * @ignore
 */
const widthClamp = clamp(1, Infinity);

/**
 * 将 CallstackData 实例转换为 CallstackOption 实例
 * @memberof adapters
 * @param stack CallstackData 实例
 * @returns
 */
const createCallstackOptionAdapter = (stack: CallstackData): CallstackOption => {
  const availableWidth = stack.availableWidth - 2 * RULE_PADDING;
  const maxTime = stack.maxTimeOffset;

  return {
    id: stack.id,
    text: `${stack.name} (${stack.totalTimeSpend}ms)`,
    // paddingLeft: (stack.timeOffset + (stack.parentTimeOffset || 0)) * availableWidth / maxTime,
    paddingLeft: (stack.timeOffset || 0) * availableWidth / maxTime,
    width: widthClamp(stack.totalTimeSpend * availableWidth / maxTime),
    color: stack.fill || 'red',
    className: 'callstack',
  };
};

export default createCallstackOptionAdapter;