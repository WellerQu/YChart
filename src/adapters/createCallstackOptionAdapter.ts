import { CallstackOption, CallstackData,} from '../../typings/defines';
import { RULE_PADDING, } from '../constants';
import { clamp, } from '../utils';

const widthClamp = clamp(2, Infinity);

const createCallstackOptionAdapter = (stack: CallstackData): CallstackOption => {
  const avaliableWidth = stack.avaliableWidth - 2 * RULE_PADDING;
  const max = stack.maxDuration;

  return {
    id: stack.stackName,
    text: `${stack.stackName} (${stack.duration}ms)`,
    paddingLeft: (stack.offsetTime + (stack.parentOffsetTime || 0)) * avaliableWidth / max,
    width: widthClamp(stack.duration * avaliableWidth / max),
    color: 'red',
    className: 'callstack',
  };
};

export default createCallstackOptionAdapter;