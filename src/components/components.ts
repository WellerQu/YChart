/// <reference path="../../node_modules/snabbdom/vnode.d.ts" />
/// <reference path="../../node_modules/snabbdom/h.d.ts" />

/**
 * @module components
 */

import { VNode, } from 'snabbdom/vnode';
import { h, } from 'snabbdom/h';
import { Position, SVGOption, } from '../../typings/defines';

import {
  TextOption,
  ImageOption,
  GroupOption,
  LineOption,
  CircleOption,
  ArrowOption,
  RectOption,
  Component,
  Strategy,
} from '../../typings/defines';
import { toArrowD, } from '../utils';

/**
 * snabbdom 需要的class样式数据结构
 */
interface ClassName {
  [key: string]: boolean;
};

/**
 * 将以空格连接的类样式字符串解析为ClassName类型的对象实例
 * @param classNames 样式名
 * @returns
 */
const parseClassName = (classNames: string): ClassName => {
  if (!classNames) 
    return {};

  return classNames
    .split(' ')
    .reduce<ClassName>((classObject: ClassName, key: string) => {
    if (key && key.trim())
      classObject[key] = true;
    return classObject;
  }, {});
};

/**
 * 创建一个SVG的VNode
 * @param option SVG的配置项
 * @returns
 */
export const createSvg = (option: SVGOption): VNode => {
  const { size, viewbox, } = option;
  return h(
    'svg',
    {
      attrs: {
        width: size.width,
        height: size.height,
        viewBox: [viewbox.x, viewbox.y, viewbox.width, viewbox.height,].join(','),
        // preserveAspectRatio: 'xMidYMid meet',
      },
    },
    []
  );
};

/**
 * 创建一个SVGGElement的VNode
 * @param option SVGGElement的配置项
 * @returns
 */
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

/**
 * 创建一个用于创建style的策略函数, 该函数将会创建一个VNode
 * @param styleSheet 用于SVG的样式
 * @returns
 */
export const createStyle: Component<string> = (styleSheet: string): Strategy => (parentNode: VNode) => {
  parentNode.children.push(h('style', { ns: 'http://www.w3.org/2000/svg', }, styleSheet));
  return parentNode;
};

/**
 * 创建一个用于创建Image的策略函数, 该策略函数将会创建一个VNode
 * @param option 图片配置
 * @returns
 */
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

/**
 * 创建一个用于创建文本Text的策略函数, 该策略函数将会创建一个VNode
 * @param option 文本配置
 * @returns
 */
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

/**
 * 创建一个用于穿件圆环的策略函数, 该函数将会创建一个VNode
 * @param option 圆环配置
 * @returns
 */
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

/**
 * 创建一个用于创建线段的策略函数, 该策略函数将会创建一个VNode
 * @param option 线段配置
 * @returns
 */
export const createLine: Component<LineOption> = (option: LineOption): Strategy => (parentNode: VNode) => {
  const { L = [], } = option;
  const actions = L.map<string>((item: Position) => {
    return `L${item.x},${item.y}`;
  });
  const classObject = parseClassName(option.className);

  parentNode.children.push(
    h('path', {
      attrs: {
        d: `M${option.x1},${option.y1} ${actions.join(' ')} L${option.x2},${option.y2}`,
        fill: 'none',
        stroke: option.strokeColor,
        'stroke-width': option.strokeWidth,
        id: `line${option.id}`,
      },
      class: { ...classObject, 'link-line': true, },
      ns: 'http://www.w3.org/2000/svg',
    })
  );

  return parentNode;
};

/**
 * 创建一个用于穿件箭头的策略函数, 该策略函数将会创建一个VNode
 * @param option 箭头配置
 * @returns
 */
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

/**
 *  创建一个用于创建矩形的策略函数, 该策略函数将会创建一个VNode
 * @param option 矩形配置
 * @returns
 */
export const createRect: Component<RectOption> = (option: RectOption): Strategy => (parentNode: VNode) => {
  const { className, strokeWidth, ...others } = option;
  const classObject = parseClassName(className);

  parentNode.children.push(
    h('rect', {
      attrs: {
        'stroke-width': strokeWidth,
        ...others,
      },
      class: { ...classObject, },
      ns: 'http://www.w3.org/2000/svg',
    })
  );
  
  return parentNode;
};

