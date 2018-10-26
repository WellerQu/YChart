import { VNode } from 'snabbdom/vnode';
import { TextOption, ImageOption, GroupOption, LineOption, CircleOption, ArrowOption, SvgOption } from '../../typings/defines';
export declare const createSvg: (option: SvgOption) => VNode;
export declare const createGroup: (option: GroupOption) => VNode;
export declare const createImage: (option: ImageOption) => (parentNode: VNode) => VNode;
export declare const createText: (option: TextOption) => (parentNode: VNode) => VNode;
export declare const createCircle: (option: CircleOption) => (parentNode: VNode) => VNode;
export declare const createLine: (option: LineOption) => (parentNode: VNode) => VNode;
export declare const createArrow: (option: ArrowOption) => (pardentNode: VNode) => VNode;
