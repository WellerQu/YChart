import { VNode } from 'snabbdom/vnode';
import { ArrowLineOption } from '../../typings/defines';
declare const createArrowLine: (option: ArrowLineOption) => (parentNode: VNode) => VNode;
export default createArrowLine;
