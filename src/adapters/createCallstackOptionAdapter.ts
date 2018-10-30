import { CallstackOption, CallstackData,} from '../../typings/defines';
import { RULE_PADDING, } from '../constants';

const createCallstackOptionAdapter = (stack: CallstackData, max: number, width: number): CallstackOption => {

  const availableWidth = width - 2 * RULE_PADDING;

  return {
    id: stack.stackName,
    text: stack.stackName,
    paddingLeft: stack.offsetTime * availableWidth / max,
    width: stack.duration * availableWidth / max,
    color: 'red',
    className: 'callstack',
    parentPaddingLeft: stack.parentOffsetTime ? stack.parentOffsetTime * availableWidth / max : 0,
  };
};

export default createCallstackOptionAdapter;