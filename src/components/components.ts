/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />
/// <reference path="../../node_modules/snabbdom/h.d.ts" />

import { VNode, } from 'snabbdom/vnode';
import { h, } from 'snabbdom/h';
import { Position, } from '../../typings/defines';

import {
  TextOption,
  ImageOption,
  GroupOption,
  LineOption,
  CircleOption,
  ArrowOption,
  SvgOption,
  RectOption,
  Component,
  Strategy,
} from '../../typings/defines';
import { toArrowD, } from '../utils';

type ClassName = {
  [key: string]: boolean;
};

const parseClassName = (classNames: string): ClassName => {
  if (!classNames) 
    return {};

  return classNames
    .split(' ')
    .reduce<ClassName>((classObject: ClassName, key: string) => {
    classObject[key] = true;
    return classObject;
  }, {});
};

export const createSvg = (option: SvgOption): VNode => {
  return h(
    'svg',
    {
      attrs: {
        width: option.width,
        height: option.height,
        viewBox: `0, 0, ${option.width}, ${option.height}`,
        // preserveAspectRatio: 'xMidYMid meet',
      },
    },
    []
  );
};

export const createGroup = (option: GroupOption): VNode => {
  const classObject = parseClassName(option.className);

  return h(
    'g',
    {
      class: { ...classObject, group: true, },
      style: { transform: `translate(${option.x || 0}px, ${option.y || 0}px)`, },
      ns: 'http://www.w3.org/2000/svg',
      key: option.id,
      attrs: {
        id: option.id,
      },
    },
    []
  );
};

export const createStyle: Component<string> = (styleSheet: string): Strategy => (parentNode: VNode) => {
  parentNode.children.push(h('style', { ns: 'http://www.w3.org/2000/svg', }, styleSheet));
  return parentNode;
};

export const createImage: Component<ImageOption> = (option: ImageOption): Strategy => (parentNode: VNode) => {
  const width = option.width || 50;
  const height = option.height || 50;
  const classObject = parseClassName(option.className);

  parentNode.children.push(
    h('image', {
      attrs: {
        'xlink:href': option.URL,
        width,
        height,
        x: option.x,
        y: option.y,
      },
      class: { ...classObject, },
      ns: 'http://www.w3.org/2000/svg',
    })
  );

  return parentNode;
};

export const createText: Component<TextOption> = (option: TextOption): Strategy => (parentNode: VNode) => {
  const classObject = parseClassName(option.className);

  parentNode.children.push(
    h(
      'text',
      {
        attrs: { x: option.x, y: option.y, },
        class: { ...classObject, },
        ns: 'http://www.w3.org/2000/svg',
      },
      option.content
    )
  );

  return parentNode;
};

export const createCircle: Component<CircleOption> = (option: CircleOption): Strategy => (parentNode: VNode) => {
  const classObject = parseClassName(option.className);

  parentNode.children.push(
    h('circle', {
      attrs: {
        cx: option.cx,
        cy: option.cy,
        r: option.radius,
        fill: option.fill,
      },
      class: { ...classObject, },
      ns: 'http://www.w3.org/2000/svg',
    })
  );

  return parentNode;
};

export const createLine: Component<LineOption> = (option: LineOption): Strategy => (parentNode: VNode) => {
  const { L = [], } = option;
  const actions = L.map<string>((item: Position) => {
    return `L${item.x},${item.y}`;
  });

  parentNode.children.push(
    h('path', {
      attrs: {
        d: `M${option.x1},${option.y1} ${actions.join(' ')} L${option.x2},${option.y2}`,
        fill: 'none',
        stroke: option.strokeColor,
        'stroke-width': option.strokeWidth,
        id: `line${option.id}`,
      },
      class: { 'link-line': true, },
      ns: 'http://www.w3.org/2000/svg',
    })
  );

  return parentNode;
};

export const createArrow: Component<ArrowOption> = (option: ArrowOption): Strategy => (pardentNode: VNode) => {
  const { x, y, width, height, } = option;

  pardentNode.children.push(h('path', {
    attrs: {
      d: toArrowD(x, y, width, height),
      fill: option.fill,
      transform: 'rotate(0, 0 0)',
      id: `arrow${option.id}`,
    },
    class: { arrow: true, },
    ns: 'http://www.w3.org/2000/svg',
  }));

  return pardentNode;
};

export const createRect: Component<RectOption> = (option: RectOption): Strategy => (parentNode: VNode) => {
  const { className, strokeWidth, ...others } = option;
  const classObject = parseClassName(className);

  parentNode.children.push(
    h('rect', {
      attrs: {
        'stroke-width': strokeWidth,
        ...others,
      },
      class: classObject,
      ns: 'http://www.w3.org/2000/svg',
    })
  );
  
  return parentNode;
};

