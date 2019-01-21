import toNode from 'snabbdom/tovnode';
import { init, } from 'snabbdom/snabbdom';
import attributes from 'snabbdom/modules/attributes';
import style from 'snabbdom/modules/style';
import classes from 'snabbdom/modules/class';
import eventlistener from 'snabbdom/modules/eventlisteners';

import { svg, } from '../components/components';
import { InstanceCreator, ChartOption, Viewbox, Size, StrategyID, } from './core';
import { TOPO_OPERATION_STATE, TOPO_LAYOUT_STATE, } from '../constants/constants';
import { isNull, } from '../utils';

const vPatch = init([
  classes,
  style,
  attributes,
  eventlistener,
]);

const instance: InstanceCreator = (option?: ChartOption) => {
  let size: Size = !option ? { width: 800, height: 600, } : option.size;
  let viewbox: Viewbox = !option ? [0, 0, size.width, size.height,] : option.viewbox;

  let $vnode = toNode(option.container);
  let $stage = svg({ size, viewbox, });

  const reset = () => {
    $stage.children = [];
  };

  let operations = TOPO_OPERATION_STATE.NONE;
  let layout = TOPO_LAYOUT_STATE.CIRCLE;
  let scale = 1;

  // 初始化事件代理对象
  const events = new Map<string, Array<Function>>();
  events .set('click', []); // Just support click behavior, now

  // 添加事件支持
  // const $vnode = instance.getStage();
  $stage.data.on = {
    click: (...args: any[]) => events.get('click').forEach((fn: Function) => fn.call($vnode, ...args)),
  };

  return ({
    viewbox: (value?: Viewbox) => {
      if (value) {
        // modify elm and vnode
        viewbox = value;
        $stage.data.attrs.viewBox = value.join(',');

        if ($vnode.elm && $vnode.sel === 'svg') {
          ($vnode.elm as SVGElement).setAttribute('viewBox', value.join(','));
        }
      }

      return viewbox;
    },
    size: (value?: Size) => {
      if (value) {
        // modify elm and vnode
        size = value;
        $stage.data.attrs.width = value.width;
        $stage.data.attrs.height = value.height;

        if ($vnode.elm && $vnode.sel === 'svg') {
          ($vnode.elm as SVGElement).setAttribute('width', `${size.width}px`);
          ($vnode.elm as SVGElement).setAttribute('height', `${size.height}px`);
        }
      }

      return size;
    },
    getStage: () => $stage,
    update: (strategy: StrategyID) => strategy($stage),
    patch: () => {
      $vnode = vPatch($vnode, {...$stage,});
    }, 
    reset,
    destroy: () => {
    },
    operation: (value?: TOPO_OPERATION_STATE) => {
      if (!isNull(value)) {
        operations = value;
      }

      return operations;
    },
    scale: (value?: number) => {
      if (!isNull(value)) {
        reset();
        scale = 1 / value;
      }

      return scale;
    },
    layout: (value?: TOPO_LAYOUT_STATE) => {
      if (!isNull(value)) {
        reset();
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
  });
};

instance.of = (option?: ChartOption) => instance(option);

export default instance;