import toNode from 'snabbdom/tovnode';
import { init, } from 'snabbdom/snabbdom';
import attributes from 'snabbdom/modules/attributes';
import style from 'snabbdom/modules/style';
import classes from 'snabbdom/modules/class';
import eventlistener from 'snabbdom/modules/eventlisteners';

import { svg, } from '../components/components';
import { InstanceCreator, ChartOption, Viewbox, Size, Strategy, } from './core';

const vPatch = init([
  classes,
  style,
  attributes,
  eventlistener,
]);

const instance: InstanceCreator = (option: ChartOption) => {
  let size: Size = !option || !option.size ? { width: 800, height: 600, } : option.size;
  let viewbox: Viewbox = !option || !option.viewbox ? [0, 0, size.width, size.height,] : option.viewbox;

  let $vnode = toNode(option.container);
  let $stage = svg({ size, viewbox, });

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
    add: (strategy: Strategy) => strategy($stage),
    patch: () => $vnode = vPatch($vnode, {...$stage,}), 
    reset: () => $stage.children = [],
    destroy: () => {},
  });
};

export default instance;