import { VNode } from "../../node_modules/snabbdom/vnode";
import { h } from "../../node_modules/snabbdom/h";

import {
  TextOption,
  ImageOption,
  GroupOption,
  LineOption,
  CircleOption,
  ArrowOption,
} from "../../typings/defines";

export namespace component {
  export const createSvg = (option?: any): VNode => {
    return h("svg", { attrs: { width: "100%", height: "100%" } }, []);
  };

  export const createGroup = (option: GroupOption): VNode => {
    return h(
      "g",
      {
        class: { [option.className]: true, group: true },
        style: { transform: `translate(${option.x || 0}px, ${option.y || 0}px)`, },
        ns: "http://www.w3.org/2000/svg",
      },
      []
    );
  };

  export const createImage = (option: ImageOption) => (parentNode: VNode) => {
    const width = option.width || 50;
    const height = option.height || 50;

    parentNode.children.push(
      h("image", {
        attrs: {
          "xlink:href": option.URL,
          width,
          height
        },
        class: { [option.tag]: !!option.tag },
        ns: "http://www.w3.org/2000/svg"
      })
    );

    return parentNode;
  };

  export const createText = (option: TextOption) => (parentNode: VNode) => {
    parentNode.children.push(
      h(
        "text",
        {
          attrs: { x: option.x, y: option.y },
          class: { [option.tag]: !!option.tag },
          ns: "http://www.w3.org/2000/svg"
        },
        option.content
      )
    );

    return parentNode;
  };

  export const createCircle = (option: CircleOption) => (parentNode: VNode) => {
    parentNode.children.push(
      h("circle", {
        attrs: {
          cx: option.cx,
          cy: option.cy,
          r: option.radius,
          fill: option.fill,
        },
        class: { [option.tag]: !!option.tag },
        ns: "http://www.w3.org/2000/svg",
      })
    );

    return parentNode;
  };

  export const createLine = (option: LineOption) => (parentNode: VNode) => {
    parentNode.children.push(
      h("path", {
        attrs: {
          d: `M${option.x1},${option.y1} Q${(option.x2 - option.x1) / 2 + option.x1},${option.y1 + 50} ${option.x2},${option.y2}`,
          fill: "none",
          stroke: option.strokeColor,
          "stroke-width": option.strokeWidth,
          id: option.tag,
        },
        class: { [option.tag]: !!option.tag },
        ns: "http://www.w3.org/2000/svg",
      })
    );

    return parentNode;
  };

  export const createArrow = (option: ArrowOption) => (pardentNode: VNode) => {
    pardentNode.children.push(
      h("circle", { attrs: { cx: 0, cy: 0, r: 5, fill: option.fill, }, ns: "http://www.w3.org/2000/svg", }, [
        h("animateMotion", { attrs: { dur: "4s", repeatCount: "indefinite", }, ns: "http://www.w3.org/2000/svg", }, [
          h("mpath", { attrs: { "xlink:href": `#${option.tag}`, }, ns: "http://www.w3.org/2000/svg", }),
        ])
      ])
    );

    return pardentNode;
  };
}
