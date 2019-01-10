import { VNodeData, VNode, } from 'snabbdom/vnode';
import { h, } from 'snabbdom';
import { Viewbox, TextOption, CreateComponent, StrategyID, SvgOption, GroupOption, } from '../cores/core';
import functor from '../cores/functor';

const vNodeData = (option: VNodeData) => ({
  ...option,
  ns: 'http://www.w3.org/2000/svg',
});

const id = (x: any) => x;

export const appendTo = ($node: VNode): StrategyID => 
  ($parent: VNode) => 
    ($parent.children.push($node), $parent);

export const svg = (option: SvgOption) => h('svg', vNodeData({
  attrs: {
    width: option.size.width,
    height: option.size.height,
    viewbox: option.viewbox.join(','),
  },
}), []);

export const text = (option: TextOption) => h('text', vNodeData({
  attrs: {
    x: option.x,
    y: option.y,
  },
  class: option.className,
}), option.content);

export const group = (option: GroupOption, children?: VNode[] ) => h(
  'g',
  vNodeData({
    attrs: {
      id: option.id,
    },
    class: { ...option.className, group: true, },
    style: { transform: `translate(${option.x}px, ${option.y}px)`, },
  }),
  children || []
);

export const doubleText = (option: TextOption[]) => 
  functor(option)
    .map((options: TextOption[]) => options.map(text))
    .map((nodes: VNode[]) => group({ id: '321', x: 0, y: 0, }, nodes))
    .fold(id);

export const component = (create: CreateComponent) =>
  (option: any) =>
    (appendTo: (node: VNode) => StrategyID) =>
      functor(option)
        .map(create)
        .map(appendTo)
        .fold(id);

export const createText = (option: TextOption) =>
  functor(component)
    .ap(functor(text))
    .ap(functor(option))
    .ap(functor(appendTo))
    .fold(id);

export const createGroup = (option: GroupOption) =>
  functor(component)
    .ap(functor(group))
    .ap(functor(option))
    .ap(functor(appendTo))
    .fold(id);

export const createDoubleText = (option: TextOption[]) =>
  functor(component)
    .ap(functor(doubleText))
    .ap(functor(option))
    .ap(functor(appendTo))
    .fold(id);