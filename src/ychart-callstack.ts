import { CallstackData, } from './@types';
import toNode from 'snabbdom/tovnode';
import { VNode, } from 'snabbdom/vnode';
import { init, h, } from 'snabbdom/snabbdom';
import attributes from 'snabbdom/modules/attributes';
import style from 'snabbdom/modules/style';
import classes from 'snabbdom/modules/class';
import eventlistener from 'snabbdom/modules/eventlisteners';
import Stack from './cores/Stack';
import { INDENT, TEXT_AREA_WIDTH, } from './constants/constants';

const vPatch = init([
  classes,
  style,
  attributes,
  eventlistener,
]);

const flatten = (node: CallstackData): CallstackData[] => {
  if (!node) return [];
  if (!node.children) return [node,];

  return node.children.reduce<CallstackData[]>((arr: CallstackData[], item: CallstackData) => {
    return arr.concat(flatten(item));
  }, [node,]);
};

const PRIMARY_COLOR = 'hsl(180, 100%, 35%)';

const stylesheet = `
.callstack {
  padding: 0 50px 0 20px;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
  font-weight: 400;
  font-size: .875rem;
  line-height: 1.15;
}
.callstack .rule {
  height: 25px;
  background: white;
  position: relative;
  z-index: 2;
}
.callstack ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.callstack .tree, .callstack .node {
  position: relative;
}
.callstack .node .folder {
  position: absolute;
  width: 15px;
  height: 15px;
  top: 2px;
  background: ${PRIMARY_COLOR};
  z-index: 2;
  border-radius: 3px;
}
.callstack .node .folder + input {
  display: none;
}
.callstack .node .folder + input:checked + ul {
  display: none;
}
.callstack .tree:before {
  content: '';
  position: absolute;
  top: -35px;
  bottom: 0;
  left: 0;
  display: block;
  border-left: solid 1px hsl(206, 9%, 85%);
}
.callstack .root.tree:before {
  top: 9px;
}
.callstack .node:last-child:before {
  content: '';
  display: block;
  background: white;
  position: absolute;
  left: 0;
  top: 9px;
  bottom: 0;
  width: 1px;
}
.callstack .data-bar {
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 0 0 1px;
}
.callstack .info-bar {
  box-sizing: border-box;
  padding: 0 16px;
  font-size: 80%;
  margin: 0 0 20px 0;
}
.callstack .data-bar .elapsed-time {
  position: relative;
}
.callstack .data-bar .elapsed-time:after {
  content: attr(data-elapsed-time);
  font-size: 10px;
  font-weight: bold;
  display: block;
  position: absolute;
  max-width: 60px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}
.callstack .data-bar .line {
  position: absolute;
  right: 0;
  border-top: solid 1px hsl(206, 9%, 85%);
  z-index: -1;
  transform: scaleY(0.5);
}
.callstack .title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: white;
  box-sizing: border-box;
  padding: 0 16px;
  display: inline-block;
  vertical-align: middle;
  color: hsl(180, 100%, 35%);
}
`;

export default (container: HTMLElement) => {
  let oldNode = toNode(container);
  
  return (data: CallstackData) => {
    const stackList = flatten(data);
    const maxDuration = Math.max(...stackList.map(n => n.elapsedTime + (n.timeOffset || 0)));

    const stack = new Stack(data, 0, maxDuration);
    const newNode = h('div', {
      class: { callstack: true, },
    }, [
      // 添加公共样式
      h('style', {}, stylesheet),
      // 添加标尺
      h('div', {
        class: { rule: true, },
      }),
      // 添加树形组件
      h('ul', {
        class: { tree: true, root: true, },
      }, stack.render()),
    ]);

    oldNode = vPatch(oldNode, newNode);
  };
};