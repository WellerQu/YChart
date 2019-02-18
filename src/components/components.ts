import { VNodeData, VNode, } from 'snabbdom/vnode';
import { h, } from 'snabbdom';
import { 
  TextOption, 
  StrategyID, 
  SvgOption, 
  GroupOption, 
  ImageOption, 
  CircleOption, 
  LineOption, 
  ArrowOption,
  RectOption, 
} from '../cores/core';
import { NODE_TYPE, } from '../constants/constants';
import { isNull } from '../utils';

const vNodeData = (option: VNodeData) => ({
  ...option,
  ns: 'http://www.w3.org/2000/svg',
});

export const appendTo = ($node: VNode): StrategyID => 
  ($parent: VNode) => 
    ($parent.children.push($node), $parent);

export const svg = (option: SvgOption) => h('svg', vNodeData({
  attrs: {
    width: option.size.width,
    height: option.size.height,
    viewBox: option.viewbox.join(','),
  },
}), []);

export const text = (option: TextOption) => h('text', vNodeData({
  attrs: {
    x: option.x,
    y: option.y,
    id: option.id,
  },
  key: option.id,
  class: option.className,
}), option.content);

export const circle = (option: CircleOption) => h('circle', vNodeData({
  attrs: {
    cx: option.x,
    cy: option.y,
    r: option.radius,
    fill: option.fill || 'transparent',
    stroke: option.stroke || 'transparent',
  },
  class: option.className,
}));

export const rect = (option: RectOption) => h('rect', vNodeData({
  attrs: {
    x: option.x,
    y: option.y,
    width: option.width,
    height: option.height,
    rx: option.rx || 0,
    ry: option.ry || 0,
    fill: option.fill || 'transparent',
    stroke: option.stroke || 'transparent',
  },
}));

export const group = (option: GroupOption, children?: VNode[] ) => h(
  'g',
  vNodeData({
    attrs: {
      id: option.id,
    },
    key: option.id,
    class: { ...option.className, [NODE_TYPE.NODE]: true, },
    style: { transform: `translate(${option.x}px, ${option.y}px)`, },
  }),
  children || []
);

export  const arrow = (option: ArrowOption, stroke = 'hsl(214, 100%, 60%)', fill = 'hsl(214, 100%, 60%)') => h(
  'path',
  vNodeData({
    attrs: {
      id: `arrow-${option.id}`,
      d: `M${option.source.x},${option.source.y} L${option.middle.x},${option.middle.y} L${option.target.x},${option.target.y} z`,
      stroke,
      'stroke-width': 1,
      fill,
      display: option.display || 'block',
    },
    key: `arrow-${option.id}`,
    class: {...option.className, [NODE_TYPE.ARROW]: true, },
  }),
);

export const line = (option: LineOption, stroke = 'hsl(214, 100%, 60%)') => h(
  'path',
  vNodeData({
    attrs: {
      id: `line-${option.id}`,
      d: `M${option.source.x},${option.source.y} L${option.target.x},${option.target.y}`,
      stroke,
      'stroke-width': 1,
    },
    key: `line-${option.id}`,
    class: {...option.className, [NODE_TYPE.LINE]: true, },
  })
);

export const image = (option: ImageOption) => h('image', vNodeData({
  attrs: {
    'xlink:href': option.URL,
    width: option.width,
    height: option.height,
    x: option.x,
    y: option.y,
    opacity: isNull(option.opacity) ? 1 : option.opacity,
  },
}));

export const style = (stylesheet: string) => h('style', vNodeData({}), stylesheet);