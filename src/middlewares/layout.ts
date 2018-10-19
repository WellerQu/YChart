import { VNode } from '../../node_modules/snabbdom/vnode';
import { Stage, PatchFn, TopoData, MiddlewareFn } from '../../typings/defines';

const transformPoistion = (x: number, y: number) => `transform: translate(${x}px, ${y}px)`;

// Example for middleware that show how to layout all elements
export const layout = (width: number): MiddlewareFn => (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  // 按类型分组: 分成USER组, Server组, 其他(DATABASE/RPC/HTTP)组, Line组
  const nodes: (string | VNode)[] = stage.getStageNode().children;
  const userGroup: VNode[] = [];
  const serverGroup: VNode[] = [];
  const otherGroup: VNode[] = [];
  const lineGroup: VNode[] = [];

  for (let i =0, len = nodes.length; i < len; i++) {
    const node: VNode = nodes[i] as VNode;

    if (!node.data)
      continue;

    const classNames = Object.keys(node.data.class);

    if (~classNames.indexOf('line')) {
      lineGroup.push(node);
      continue;
    }

    if (classNames.find(n => n.startsWith('USER-'))) {
      userGroup.push(node);
      continue;
    }

    if (classNames.find(n => n.startsWith('SERVER-'))) {
      serverGroup.push(node);
      continue;
    }

    otherGroup.push(node);
  }

  console.log(userGroup, serverGroup, otherGroup, lineGroup);

  next(userState);
};
