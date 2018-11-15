/**
 * @module adapters
 */

import { CallstackOption, CallstackData,} from '../../typings/defines';
import { RULE_PADDING, } from '../constants/constants';
import { clamp, } from '../utils';

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
  const maxTime = stack.maxDuration;

  return {
    id: stack.stackName,
    text: `${stack.stackName} (${stack.duration}ms)`,
    paddingLeft: (stack.offsetTime + (stack.parentOffsetTime || 0)) * availableWidth / maxTime,
    width: widthClamp(stack.duration * availableWidth / maxTime),
    color: 'red',
    className: 'callstack',
  };
};

export default createCallstackOptionAdapter;