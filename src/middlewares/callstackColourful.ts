import { Stage, PatchFn, TopoData, } from '../../typings/defines';
import { VNode, } from 'snabbdom/vnode';

const COLOURS = ['#99CCCC', '#FFCC99', '#FFCCCC', '#FF9999', '#996699', '#FFCCCC', '#CC9999', '#CCCC99', '#CCCCFF',];

// 调用栈着色
export const callstackColourful = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  const nodes: (string | VNode)[] = stage.getStageNode().children;

  nodes.filter((item: (VNode|string)) => {
    const node = item as VNode;
    if (!node.data.class)
      return false;

    if (!node.data.class['callstack'])
      return false;
    
    return true;
  }).forEach((item: VNode, index: number) => {
    const rectNode = item.children[0] as VNode;
    rectNode.data.attrs.stroke = rectNode.data.attrs.fill = COLOURS[index];
  });

  next(userState);
};