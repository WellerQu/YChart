import toNode from 'snabbdom/tovnode';
import { init, } from 'snabbdom/snabbdom';
import attributes from 'snabbdom/modules/attributes';
import style from 'snabbdom/modules/style';
import classes from 'snabbdom/modules/class';
import eventlistener from 'snabbdom/modules/eventlisteners';
import { svg, } from '../components/components';
import { InstanceCreator, ChartOption, Viewbox, Size, StrategyID, } from './core';
import { TOPO_OPERATION_STATE, TOPO_LAYOUT_STATE, } from '../constants/constants';
import { graph, isNull, } from '../utils';
import { VNode, } from 'snabbdom/vnode';

const vPatch = init([
  classes,
  style,
  attributes,
  eventlistener,
]);

const instance: InstanceCreator = (option?: ChartOption) => {
  const events = new Map<string, Array<Function>>();
  events .set('click', []); // Just support click behavior

  const initializeEvent = (events: Map<string, Array<Function>>) => ($vnode: VNode, option?: ChartOption) => {
    $vnode.data.on = {
      click: (...args: any[]) => events.get('click').forEach((fn: Function) => fn.call($vnode, ...args)),
    };

    return $vnode;
  };
  const svgEvents = initializeEvent(events);

  let scale = 1;
  let size = !option ? { width: 0, height: 0, } : option.size;
  let viewbox: Viewbox = !option ? [0, 0, size.width, size.height,] : option.viewbox;
  let operations = TOPO_OPERATION_STATE.NONE;
  let layout = TOPO_LAYOUT_STATE.CIRCLE;

  let $vnode = toNode(option.container);
  let $stage = svgEvents(svg({ size, viewbox, }));

  const reset = () => ($stage = svgEvents(svg({ size, viewbox, })));

  return {
    viewbox: (value?: Viewbox) => {
      if (value) {
        // modify elm and vnode
        viewbox = value;
        $stage.data.attrs.viewbox = value.join(',');

        if ($stage.elm) {
          ($stage.elm as SVGElement).setAttribute('viewbox', value.join(','));
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

        if ($stage.elm) {
          ($stage.elm as SVGElement).setAttribute('width', `${size.width}px`);
          ($stage.elm as SVGElement).setAttribute('height', `${size.height}px`);
        }
      }

      return size;
    },
    scale: (value?: number) => {
      if (value) {
        // modify elm and vnode
        scale = value;

        const { x, y, width, height, } = graph($stage);
        $stage.data.attrs.viewbox = [
          (size.width * value - width) / -2 + x, 
          (size.height * value - height) / -2 + y, 
          size.width * value, 
          size.height * value,].join(',');

        if ($stage.elm) {
          ($stage.elm as SVGElement).setAttribute('viewBox', $stage.data.attrs.viewbox);
        }
      }

      return scale;
    },
    operation: (value?: TOPO_OPERATION_STATE) => {
      if (!isNull(value)) {
        operations = value;
      }

      return operations;
    },
    layout: (value?: TOPO_LAYOUT_STATE) => {
      if (!isNull(value)) {
        reset();
        layout = value;
      }

      return layout;
    },
    getStage: () => $stage,
    update: (strategy: StrategyID) => strategy($stage),
    patch: () => $vnode = vPatch($vnode, $stage),
    reset,
    addEventListener: (eventName: string, callback: Function) => {
      events.get(eventName).push(callback);
    },
    removeEventListener: (eventName: string, callback?: Function) => {
      events.set(eventName, events.get(eventName).filter(item => item !== callback));
    },
    destroy: () => {
    },
  };
};

instance.of = (option?: ChartOption) => instance(option);

export default instance;