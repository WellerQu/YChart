import { UpdateFn, CallstackData, SubscriberFn, StrategyFn } from '../typings/defines';
import createStage from './createStage';
import createCallstack from './components/createCallstack';

const flatten = (node: CallstackData): StrategyFn[] => {
  const stacks: StrategyFn[] = [];

  stacks.push(createCallstack({
    id: node.stackName,
    text: node.stackName,
    width: node.duration,
    color: 'red',
  }));

  if (!node.children || node.children.length === 0) return stacks;

  return node.children.reduce<StrategyFn[]>((arr: StrategyFn[], child: CallstackData) =>  arr.concat(flatten(child)), stacks);
};

export default (container: HTMLElement, updated?: SubscriberFn): UpdateFn<CallstackData> => {
  const { create, patch, subscribe, } = createStage(container);

  updated && subscribe(updated);

  return (data: CallstackData) => {
    flatten(data).forEach((strategy: StrategyFn) => create(strategy));
    patch();
  };
};