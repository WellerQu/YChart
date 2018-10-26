import { VNode } from '../../node_modules/snabbdom/vnode';
import { ServiceNodeOption } from '../../typings/defines';
declare const createServiceNode: (option: ServiceNodeOption) => (parentNode: VNode) => VNode;
export default createServiceNode;
