import { TOPO_OPERATION_STATE, TOPO_LAYOUT_STATE, } from '../constants/constants';
import { isNull, } from '../utils';
import { InstanceAPI, } from './core';
import { VNode, } from 'snabbdom/vnode';
import functor from './functor';
import id from './id';

interface InstanceState {
  allowOperations: TOPO_OPERATION_STATE;
  layoutStrategy: TOPO_LAYOUT_STATE;
  scale: Number;
}

const handlerProcess = ($delegateObject: VNode) =>
  (eventMap: Map<string, Array<Function>>) =>
    (eventType: string) =>
      (...args: any[]) =>
        eventMap.get(eventType).forEach((fn: Function) => fn.call($delegateObject, ...args));

export default (defaultState: InstanceState) => (instance: InstanceAPI) => {
  if (!defaultState) {
    defaultState = {
      allowOperations: TOPO_OPERATION_STATE.NONE,
      layoutStrategy: TOPO_LAYOUT_STATE.CIRCLE,
      scale: 1,
    };
  }

  let state = { ...defaultState, };

  // 初始化事件代理对象
  const events = new Map<string, Array<Function>>();
  events.set('click', []); // Just support click behavior, now
  events.set('mouseover', []);
  events.set('mouseout', []);

  // 添加事件支持
  const stage$ = functor(instance.getStage());
  const handler$ = functor(handlerProcess)
    .ap(functor(stage$))
    .ap(functor(events));

  stage$.fold(($vnode: VNode) => {
    $vnode.data.on = {
      click: handler$.ap(functor('click')).fold(id),
      mouseover: handler$.ap(functor('mouseover')).fold(id),
      mouseout: handler$.ap(functor('mouseout')).fold(id),
    };
  });

  return {
    ...instance,
    operation: (value?: TOPO_OPERATION_STATE) => {
      if (!isNull(value)) {
        state.allowOperations = value;
      }

      return state.allowOperations;
    },
    scale: (value?: number) => {
      if (!isNull(value)) {
        instance.reset();
        state.scale = 1 / value;
      }

      return state.scale;
    },
    layout: (value?: TOPO_LAYOUT_STATE) => {
      if (!isNull(value)) {
        instance.reset();
        state.layoutStrategy = value;
      }

      return state.layoutStrategy;
    },
    addEventListener: (eventName: string, callback: Function) => {
      events.get(eventName).push(callback);
    },
    removeEventListener: (eventName: string, callback?: Function) => {
      events.set(eventName, events.get(eventName).filter(item => item !== callback));
    },
  };
};