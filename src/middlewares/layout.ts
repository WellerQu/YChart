import { VNode } from "../../node_modules/snabbdom/vnode";
import { Stage, PatchFn, TopoData, MiddlewareFn } from "../../typings/defines";
import { NODE_SIZE, CELL_SIZE } from "../constants";
import { NODE_TYPE } from "../NODE_TYPE";
import compose from "../compose";

const transformPoistion = (x: number, y: number) => ({ transform: `translate(${x}px, ${y}px)`, });
const max = (...nums: number[]): number => {
  const _max = (x: number) => (y: number) => x > y ? x : y;
  const getResult = compose<number>(...nums.map((n: number) => _max(n)));
  return getResult(0);
};
const placeNode = (nodes: VNode[]) => (columnIndex: number): VNode[] => {
  const space = (CELL_SIZE - NODE_SIZE) / 2;

  return nodes.map((item: VNode, rowIndex: number) => {
    item.data.style = transformPoistion(CELL_SIZE * columnIndex + space, CELL_SIZE * rowIndex + space);
    return item;
  })
};
const linkLine = () => {}

// Example for middleware that show how to layout all elements
export const layout = (stage: Stage) => (next: PatchFn) => (userState?: TopoData) => {
  // 按类型分组: 分成USER组, Server组, 其他(DATABASE/RPC/HTTP)组, Line组
  const root = stage.getStageNode();
  const nodes: (string | VNode)[] = stage.getStageNode().children;
  const userGroup: VNode[] = [];
  const serverGroup: VNode[] = [];
  const otherGroup: VNode[] = [];
  const lineGroup: VNode[] = [];
  const restGroup: ( VNode | string )[] = [];

  for (let i =0, len = nodes.length; i < len; i++) {
    const node: VNode = nodes[i] as VNode;

    if (!node.data || !node.data.class) {
      restGroup.push(node);
      continue;
    }

    const classNames = Object.keys(node.data.class);

    if (~classNames.indexOf('line')) {
      lineGroup.push(node);
      continue;
    }

    if (~classNames.indexOf(NODE_TYPE.USER)) {
      userGroup.push(node);
      continue;
    }

    if (~classNames.indexOf(NODE_TYPE.SERVER)) {
      serverGroup.push(node);
      continue;
    }

    otherGroup.push(node);
  }

  // 准备摆放函数
  const placeUserGroup = placeNode(userGroup);
  const placeServiceGroup = placeNode(serverGroup);
  const placeOtherGroup = placeNode(otherGroup);

  // 准备连线函数

  const maxHeight = max(userGroup.length, serverGroup.length, otherGroup.length) * CELL_SIZE;
  const maxWidth = CELL_SIZE * 3;

  // 无论图多复杂多大, 一定会在一屏内显示完整
  root.data.attrs.viewBox = `0, 0, ${maxWidth}, ${maxHeight}`;

  root.children = [...restGroup, ...placeUserGroup(0), ...placeServiceGroup(1), ...placeOtherGroup(2), ...lineGroup];

  next(userState);
};