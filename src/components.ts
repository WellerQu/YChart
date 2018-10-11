import { VNode } from "../node_modules/snabbdom/vnode";
import { h } from "../node_modules/snabbdom/h";

import {
  TextOption,
  ImageOption,
  GroupOption,
  ImageNodeOption,
  ServerNodeOption,
  ServiceNodeOption,
  LineOption,
  CircleOption,
  ArrowOption,
} from "../typings/defines";

import compose from "./compose";

export namespace component {
  export const createSvg = (option?: any): VNode => {
    return h("svg", { attrs: { width: "100%", height: "100%" } }, []);
  };

  export const createGroup = (option: GroupOption): VNode => {
    return h(
      "g",
      {
        class: { [option.className]: true, group: true },
        ns: "http://www.w3.org/2000/svg"
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

  export namespace composed {
    export const createArrowLine = (option: LineOption & ArrowOption) => (parentNode: VNode) => {
      const createNode = compose<VNode>(
        createArrow({ x: option.x, y: option.y, fill: option.fill, tag: option.tag, }),
        createLine({ x1: option.x1, y1: option.y1, x2: option.x2, y2: option.y2, strokeColor: option.strokeColor, strokeWidth: option.strokeWidth, tag: option.tag, }),
        createGroup,
      );

      parentNode.children.push(createNode({ className: option.tag}));

      return parentNode;
    }

    export const createImageNode = (option: ImageNodeOption) => (
      parentNode: VNode
    ) => {
      const { title, URL, tag } = option;
      const createNode = compose<VNode>(
        createText({ content: title, x: 25, y: 70, tag: "title" }),
        createImage({ URL, width: 50, height: 50 }),
        createGroup
      );

      parentNode.children.push(createNode({ className: tag }));

      return parentNode;
    };

    export const createServerNode = (option: ServerNodeOption) => (
      parentNode: VNode
    ) => {
      const createNode = compose<VNode>(
        createText({ content: option.title, y: 70, }),
        createText({ content: option.instances, y: 24, }),
        createCircle({ cx: 35, cy: 35, radius: 22, fill: "white", }),
        createCircle({ cx: 35, cy: 35, radius: 35, fill: option.color, }),
        createGroup,
      );
      
      parentNode.children.push(createNode({ className: option.tag }));

      return parentNode;
    };

    export const createServiceNode = (option: ServiceNodeOption) => (
      parentNode: VNode
    ) => {
      const createNode = compose<VNode>(
        createText({ content: option.title, x: 35, y: 90, tag: "title" }),
        createText({ content: option.rpm, x: 82, y: 48, tag: "rpm" }),
        createText({ content: option.avgRT, x: 82, y: 36, tag: "avgRT" }),
        createText({ content: option.instances, x: 35, y: 35, tag: "instances" }),
        createText({ content: option.type, x: 0, y: 60, tag: "type" }),
        createCircle({ cx: 0, cy: 55, radius: 15,  fill: "#338cff", tag: "type" }),
        createCircle({ cx: 35, cy: 35, radius: 22, fill: "white", }),
        createCircle({ cx: 35, cy: 35, radius: 35, fill: option.color, tag: "health" }),
        createGroup,
      );

      parentNode.children.push(createNode({ className: option.tag }));

      return parentNode;
    };
  }
}
