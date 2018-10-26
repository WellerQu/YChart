import { VNode } from 'snabbdom/vnode';
import { ImageNodeOption } from '../../typings/defines';
declare const createImageNode: (option: ImageNodeOption) => (parentNode: VNode) => VNode;
export default createImageNode;
