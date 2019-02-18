import { TOPO_OPERATION_STATE, TOPO_LAYOUT_STATE, } from '../constants/constants';
import { isNull, } from '../utils';
import { InstanceCreator, ChartOption, InstanceState, StateCreator, } from './core';
import { VNode } from 'snabbdom/vnode';
import functor from './functor';
import id from './id';

const handlerProcess = ($delegateObject: VNode) =>
  (eventMap: Map<string, Array<Function>>) =>
    (eventType: string) =>
      (...args: any[]) =>
        eventMap.get(eventType).forEach((fn: Function) => fn.call($delegateObject, ...args));

export default (state: any) =>
  (createInstance: InstanceCreator): StateCreator =>
    (option?: ChartOption): InstanceState => {
      const ins = createInstance(option);

      let operations = TOPO_OPERATION_STATE.NONE;
      let layout = TOPO_LAYOUT_STATE.CIRCLE;
      let scale = 1;

      // 初始化事件代理对象
      const events = new Map<string, Array<Function>>();
      events.set('click', []); // Just support click behavior, now
      events.set('mouseover', []);
      events.set('mouseout', []);

      // 添加事件支持
      const stage$ = functor(ins.getStage());
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
        ...ins,
        operation: (value?: TOPO_OPERATION_STATE) => {
          if (!isNull(value)) {
            operations = value;
          }

          return operations;
        },
        scale: (value?: number) => {
          if (!isNull(value)) {
            ins.reset();
            scale = 1 / value;
          }

          return scale;
        },
        layout: (value?: TOPO_LAYOUT_STATE) => {
          if (!isNull(value)) {
            ins.reset();
            layout = value;
          }

          return layout;
        },
        addEventListener: (eventName: string, callback: Function) => {
          events.get(eventName).push(callback);
        },
        removeEventListener: (eventName: string, callback?: Function) => {
          events.set(eventName, events.get(eventName).filter(item => item !== callback));
        },
      };
    };