import { UpdateFn, CallstackData, SubscriberFn, StrategyFn, SvgOption, } from '../typings/defines';
import createStage from './createStage';
import createCallstack from './components/createCallstack';
import applyMiddlewares from './applyMiddlewares';

import { callstackLayout, } from './middlewares/callstackLayout';
import { callstackStyle, } from './middlewares/callstackStyle';
import { callstackColourful,} from './middlewares/callstackColourful';

import createCallstackOptionAdapter from './adapters/createCallstackOptionAdapter';
import compose from './compose';
import { max, } from './utils';
import { createSvg, } from './components/components';
import { createRule, } from './components/createRule';

function flatten<T extends { children?: T[], parentOffsetTime?: number, offsetTime: number }> (node: T): T[] {
  const stacks: T[] = [];

  stacks.push(node);

  if (!node.children || node.children.length === 0) return stacks;

  return node.children.reduce<T[]>((arr: T[], item: T) => {
    item.parentOffsetTime = node.offsetTime;
    return arr.concat(flatten<T>(item));
  }, stacks);
};

const callstack = compose<StrategyFn>(
  createCallstack,
  createCallstackOptionAdapter 
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

    const flattenData = flatten<CallstackData>(data);
    const maxDuration = max(...flattenData.map(n => n.duration));

    create(createRule({
      min: 0,
      max: maxDuration,
      step: 100,
    }));

    flattenData.forEach((item: CallstackData) => create(callstack(item, maxDuration, root.data.attrs.width as number)));
    patch(data);
  };
};