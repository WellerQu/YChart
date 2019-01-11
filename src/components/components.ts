import { VNodeData, VNode, } from 'snabbdom/vnode';
import { h, } from 'snabbdom';
import { TextOption, StrategyID, SvgOption, GroupOption, ImageOption, CircleOption, } from '../cores/core';

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
  },
  class: option.className,
}), option.content);

export const circle = (option: CircleOption) => h('circle', vNodeData({
  attrs: {
    cx: option.x,
    cy: option.y,
    r: option.radius,
    fill: option.fill,
  },
  class: option.className,
}));

export const group = (option: GroupOption, children?: VNode[] ) => h(
  'g',
  vNodeData({
    attrs: {
      id: option.id,
    },
    key: option.id,
    class: { ...option.className, group: true, },
    style: { transform: `translate(${option.x}px, ${option.y}px)`, },
  }),
  children || []
);

export const image = (option: ImageOption) => h('image', vNodeData({
  attrs: {
    'xlink:href': option.URL,
    width: option.width,
    height: option.height,
    x: option.x,
    y: option.y,
  },
}));

export const style = (stylesheet: string) => h('style', vNodeData({}), stylesheet);