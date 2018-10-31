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
  ComponentFn,
  StrategyFn,
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

export const createImage: ComponentFn<ImageOption> = (option: ImageOption): StrategyFn => (parentNode: VNode) => {
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

export const createText: ComponentFn<TextOption> = (option: TextOption): StrategyFn => (parentNode: VNode) => {
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

export const createCircle: ComponentFn<CircleOption> = (option: CircleOption): StrategyFn => (parentNode: VNode) => {
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

export const createLine: ComponentFn<LineOption> = (option: LineOption): StrategyFn => (parentNode: VNode) => {
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
      },
      class: { 'link-line': true, },
      ns: 'http://www.w3.org/2000/svg',
    })
  );

  return parentNode;
};

export const createArrow: ComponentFn<ArrowOption> = (option: ArrowOption): StrategyFn => (pardentNode: VNode) => {
  const { x, y, width, height, } = option;

  pardentNode.children.push(h('path', {
    attrs: {
      d: toArrowD(x, y, width, height),
      fill: option.fill,
      transform: 'rotate(0, 0 0)',
    },
    class: { arrow: true, },
    ns: 'http://www.w3.org/2000/svg',
  }));

  // 动画应该由中间件提供
  // pardentNode.children.push(
  //   h(
  //     'animateMotion',
  //     {
  //       attrs: { dur: '3s', repeatCount: 'indefinite', 'xlink:href':`#C${option.id}`, },
  //       ns: 'http://www.w3.org/2000/svg',
  //     },
  //     [
  //       // h('mpath', {
  //       //   attrs: { 'xlink:href': `#P${option.id}` },
  //       //   ns: 'http://www.w3.org/2000/svg'
  //       // })
  //     ]
  //   )
  // );

  return pardentNode;
};

export const createRect: ComponentFn<RectOption> = (option: RectOption): StrategyFn => (parentNode: VNode) => {
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

