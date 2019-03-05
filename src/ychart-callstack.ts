/**
 * @module instances
 */

import { UpdateBehavior, CallstackData, Subscriber, Strategy, Viewbox, EventOption, } from './@types';
import createStage from './cores/createStage';
import createCallstack from './components/createCallstack';
import createCallLine from './components/createCallLine';
import applyMiddlewares from './cores/applyMiddlewares';

import { callstackLayout, } from './middlewares/callstackLayout';
import { callstackStyle, } from './middlewares/callstackStyle';
import { showLoading, } from './middlewares/showLoading';
import { event, } from './middlewares/event';

import createCallstackOptionAdapter from './adapters/createCallstackOptionAdapter';
import compose from './compose';
import { max, } from './utils';
import { createRule, } from './components/createRule';
import clone from './clone';
import { ID_COMBINER, CALLSTACK_HEIGHT, RULE_HEIGHT, STACK_SPACE, } from './constants/constants';

function flatten (node: CallstackData): CallstackData[] {
  const stacks: CallstackData[] = [];

  stacks.push(node);

  if (!node.children || node.children.length === 0) return stacks;

  return node.children.reduce<CallstackData[]>((arr: CallstackData[], item: CallstackData) => {
    item.parentId = node.spanId;
    // item.timeOffset = 100;
    // item.parentTimeOffset = node.timeOffset + node.parentTimeOffset || 0;
    return arr.concat(flatten(item));
  }, stacks);
};

const callstack = compose<Strategy>(
  createCallstack,
  createCallstackOptionAdapter,
  clone
);

export default (container: HTMLElement, eventOption?: EventOption, updated?: Subscriber): UpdateBehavior<CallstackData> => {
  const elementID = container.id;
  const enhancer = applyMiddlewares(
    showLoading,
    callstackLayout, 
    callstackStyle,
    event(eventOption),
  );
  const createStageAt = enhancer(createStage);
  const { create, patch, subscribe, viewbox, size, stageNode, } = createStageAt(container);

  updated && subscribe(updated);

  patch();

  return (data: CallstackData, option?: Viewbox) => {
    const root = stageNode();
    root.data.attrs.id = elementID;

    viewbox(option);
    size(option);

    if (!data) return patch();

    const flattenData = flatten(data);
    const maxDuration = max(...flattenData.map(n => n.elapsedTime + (n.timeOffset || 0)));
    const availableWidth = root.data.attrs.width as number;

    // 当最大长度与刻度步长无法取整时, 需要向下取一个最近的最小可取整值
    // 比如: 步长为50, 最大值为835 则需要改成 850
    // 比如: 步长为50, 最大值为860 则需要改成 900
    let maxWidth = maxDuration;
    let RULE_STEP = Math.pow(10, (maxWidth.toString().length - 1));

    if (maxWidth % RULE_STEP !== 0) {
      const a = maxWidth / RULE_STEP >> 0;
      const b = maxWidth % RULE_STEP;

      if (b > RULE_STEP) {
        maxWidth = a * RULE_STEP + 3 * RULE_STEP;
      } else {
        maxWidth = a * RULE_STEP + 2 * RULE_STEP;
      }
    }

    create(createRule({
      min: 0,
      max: maxWidth,
      step: RULE_STEP,
      availableWidth,
    }));

    flattenData.forEach((item: CallstackData, index: number) => {
      item.maxTimeOffset = maxWidth;
      item.availableWidth = availableWidth;

      create(callstack(item)); 
      if (index > 0)
        create(createCallLine({
          id: `${item.spanId}${ID_COMBINER}${item.parentId || ''}`,
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

    const height = flattenData.length * (CALLSTACK_HEIGHT + STACK_SPACE) + RULE_HEIGHT;
    if (option) {
      option.height = height;
    }

    size(option);
    viewbox(option);

    patch(flattenData);
  };
};