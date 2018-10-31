import { UpdateFn, CallstackData, SubscriberFn, StrategyFn, SvgOption, } from '../typings/defines';
import createStage from './createStage';
import createCallstack from './components/createCallstack';
import createCallLine from './components/createCallLine';
import applyMiddlewares from './applyMiddlewares';

import { callstackLayout, } from './middlewares/callstackLayout';
import { callstackStyle, } from './middlewares/callstackStyle';
import { callstackColourful,} from './middlewares/callstackColourful';

import createCallstackOptionAdapter from './adapters/createCallstackOptionAdapter';
import compose from './compose';
import { max, } from './utils';
import { createSvg, } from './components/components';
import { createRule, } from './components/createRule';
import clone from './clone';
import { RULE_STEP, } from './constants';


function flatten (node: CallstackData): CallstackData[] {
  const stacks: CallstackData[] = [];

  stacks.push(node);

  if (!node.children || node.children.length === 0) return stacks;

  return node.children.reduce<CallstackData[]>((arr: CallstackData[], item: CallstackData) => {
    item.parentStackName = node.stackName;
    item.parentOffsetTime = node.offsetTime + node.parentOffsetTime || 0;
    return arr.concat(flatten(item));
  }, stacks);
};

const callstack = compose<StrategyFn>(
  createCallstack,
  createCallstackOptionAdapter,
  clone
);

export default (container: HTMLElement, updated?: SubscriberFn): UpdateFn<CallstackData> => {
  const elementID = container.id;
  const enhancer = applyMiddlewares(callstackColourful, callstackLayout, callstackStyle);
  const createStageAt = enhancer(createStage);
  const { getStageNode, create, patch, subscribe, } = createStageAt(container);

  updated && subscribe(updated);

  return (data: CallstackData, option?: SvgOption) => {
    const root = getStageNode();
    root.data.attrs.id = elementID;

    if (option) {
      root.data.attrs  = {
        ...root.data.attrs,
        ...createSvg(option).data.attrs,
      };
    }

    const flattenData = flatten(data);
    const maxDuration = max(...flattenData.map(n => n.duration));
    const avaliableWidth = root.data.attrs.width as number;

    // 当最大长度与刻度步长无法取整时, 需要向下取一个最近的最小可取整值
    // 比如: 步长为50, 最大值为835 则需要改成 850
    // 比如: 步长为50, 最大值为860 则需要改成 900
    let maxWidth = maxDuration;
    if (maxWidth % RULE_STEP !== 0) {
      const a = maxWidth / 100 >> 0;
      const b = maxWidth % 100;
      if (b > RULE_STEP) {
        maxWidth = a * 100 + 2 * RULE_STEP;
      } else {
        maxWidth = a * 100 + RULE_STEP;
      }
    }

    create(createRule({
      min: 0,
      max: maxWidth,
      step: RULE_STEP,
      avaliableWidth,
    }));

    flattenData.forEach((item: CallstackData, index: number) => {
      item.maxDuration = maxWidth;
      item.avaliableWidth = avaliableWidth;
      create(callstack(item)); 
      if (index > 0)
        create(createCallLine({
          id: `${item.stackName}-${item.parentStackName || ''}`,
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
          L: [{ x: 0, y: 0,},],
          strokeColor: '#000',
          strokeWidth: 1,
          className: 'callline',
        }));
    });

    patch(flattenData);
  };
};