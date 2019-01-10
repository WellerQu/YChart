/// <reference path="../../node_modules/snabbdom/modules/attributes.d.ts" />
/// <reference path="../../node_modules/snabbdom/modules/style.d.ts" />
/// <reference path="../../node_modules/snabbdom/modules/class.d.ts" />
/// <reference path="../../node_modules/snabbdom/modules/eventlisteners.d.ts" />

import toNode from 'snabbdom/tovnode';
import { init, } from 'snabbdom/snabbdom';
import attributes from 'snabbdom/modules/attributes';
import style from 'snabbdom/modules/style';
import classes from 'snabbdom/modules/class';
import eventlistener from 'snabbdom/modules/eventlisteners';
import { svg, } from '../components/components';
import { InstanceCreator, ChartOption, Viewbox, Size, StrategyID, } from './core';
import { TOPO_OPERATION_STATE, } from '../constants/constants';
import { graph, } from '../utils';

const vPatch = init([
  classes,
  style,
  attributes,
  eventlistener,
]);

const instance: InstanceCreator = (option?: ChartOption) => {
  let $vnode = toNode(option.container);
  let $stage = svg(option);

  let scale = 1;
  let size = !option ? { width: 0, height: 0, } : option.size;
  let viewbox: Viewbox = !option ? [0, 0, size.width, size.height,] : option.viewbox;
  let operations = TOPO_OPERATION_STATE.NONE;;

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
          ($stage.elm as SVGElement).setAttribute('viewbox', $stage.data.attrs.viewbox);
        }
      }

      return scale;
    },
    operation: (value?: TOPO_OPERATION_STATE) => {
      if (value) {
        operations = value;
      }

      return operations;
    },
    getStage: () => $stage,
    update: (strategy: StrategyID) => strategy($stage),
    patch: () => $vnode = vPatch($vnode, $stage),
    reset: () => $stage = svg(option),
    destroy: () => {},
  };
};

instance.of = (option?: ChartOption) => instance(option);

export default instance;