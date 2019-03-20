import { CallstackData, } from './@types';
import toNode from 'snabbdom/tovnode';
import { VNode, } from 'snabbdom/vnode';
import { init, h, } from 'snabbdom/snabbdom';
import attributes from 'snabbdom/modules/attributes';
import style from 'snabbdom/modules/style';
import classes from 'snabbdom/modules/class';
import eventlistener from 'snabbdom/modules/eventlisteners';
import Stack from './cores/Stack';
import { INDENT, TEXT_AREA_WIDTH, CALLSTACK_HEIGHT, } from './constants/constants';

const vPatch = init([
  classes,
  style,
  attributes,
  eventlistener,
]);

type Flattenable<T> = { children?: Flattenable<T>[] };

const flatten = <T>(node: Flattenable<T>): Flattenable<T>[] => {
  if (!node) return [];
  if (!node.children) return [node,];

  return node.children.reduce<Flattenable<T>[]>((arr: Flattenable<T>[], item: Flattenable<T>) => 
    arr.concat(flatten(item))
  , [node,]);
};

const PRIMARY_COLOR = 'hsl(180, 100%, 35%)';
const BORDER_COLOR = 'hsl(206, 9%, 85%)';
const SECOND = 1000; // 一秒

const stylesheet = `
.ychart-callstack {
  padding: 0 90px 0 20px;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
  font-weight: 400;
  font-size: .875rem;
  line-height: 1.15;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}
.ychart-callstack .rule {
  height: 25px;
  position: relative;
  bottom: -14px;
  z-index: 2;
  box-sizing: border-box;
  margin: 0 0 0 ${TEXT_AREA_WIDTH + 1}px;
  display: flex;
  align-items: flex-end;
}
.ychart-callstack .rule .calibration:not(:first-child) {
  flex: 1;
}
.ychart-callstack .rule .calibration {
  box-sizing: border-box;
  width: 1px;
  height: 8px;
  border-right: solid 1px ${BORDER_COLOR};
  position: relative;
}
.ychart-callstack .rule .calibration:before {
  content: attr(data-calibration);
  font-size: 10px;
  position: absolute;
  right: 0;
  top: -12px;
  transform: translateX(50%);
  white-space: nowrap;
}
.ychart-callstack .shadow {
  height: ${CALLSTACK_HEIGHT / 2}px;
  position: relative;
  bottom: -54px;
  z-index: 2;
  box-sizing: border-box;
  margin: 0 0 0 ${TEXT_AREA_WIDTH + 1}px;
}
.ychart-callstack .shadow-item {
  position: absolute;
  height: 100%;
  top: 0;
  opacity: 0.5;
  min-width: 8px;
}
.ychart-callstack ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ychart-callstack .tree, .ychart-callstack .node {
  position: relative;
}
.ychart-callstack .node .folder {
  position: absolute;
  width: 16px;
  height: 16px;
  top: 10px;
  background: ${PRIMARY_COLOR};
  z-index: 2;
  border-radius: 3px;
  cursor: pointer;
}
.ychart-callstack .node .folder + input {
  display: none;
}
.ychart-callstack .node .folder + input:checked + ul {
  display: none;
}
.ychart-callstack .node .folder + input ~ .plus {
  position: absolute;
  top: 11px;
  display: block;
  width: 14px;
  height: 14px;
  background: ${PRIMARY_COLOR} url('/static/images/plus@callstack.png') no-repeat center center;
  background-size: cover;
  pointer-events: none;
  z-index: 2;
}
.ychart-callstack .node .folder + input ~ .reduce {
  position: absolute;
  top: 11px;
  display: block;
  width: 14px;
  height: 14px;
  background: ${PRIMARY_COLOR} url('/static/images/reduce@callstack.png') no-repeat center center;
  background-size: cover;
  pointer-events: none;
  z-index: 2;
}
.ychart-callstack .node .folder + input:checked ~ .reduce {
  display: none;
}
.ychart-callstack .tree:before {
  content: '';
  position: absolute;
  top: -35px;
  bottom: 0;
  left: 0;
  display: block;
  border-left: solid 1px ${BORDER_COLOR};
}
.ychart-callstack .root.tree:before {
  top: 9px;
}
.ychart-callstack .node:last-child:before {
  content: '';
  display: block;
  background: white;
  position: absolute;
  left: 0;
  top: 17px;
  bottom: 0;
  width: 1px;
}
.ychart-callstack .data-bar {
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 0 0 1px;
}
.ychart-callstack .info-bar {
  color: hsl(0, 0%, 77%);
  box-sizing: border-box;
  padding: 2px 16px 0;
  font-size: 80%;
  line-height: 1.2;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}
.ychart-callstack .selectable {
  padding: 8px 0 20px 0;
  transition: background 0.2s;
}
.ychart-callstack .selectable.highlight {
  background: hsl(0, 0%, 96%);
}
.ychart-callstack .selectable.highlight .title {
  background: hsl(0, 0%, 96%);
}
.ychart-callstack .data-bar .elapsed-time {
  position: relative;
  cursor: pointer;
  min-width: 8px;
}
.ychart-callstack .data-bar .elapsed-time:hover {
  opacity: 0.7;
}
.ychart-callstack .data-bar .elapsed-time:after {
  content: attr(data-elapsed-time);
  font-size: 12px;
  font-weight: bold;
  display: block;
  position: absolute;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  padding: 0 4px;
}
.ychart-callstack .data-bar .line {
  position: absolute;
  right: 0;
  border-top: solid 1px ${BORDER_COLOR};
  transform: scaleY(0.5);
}
.ychart-callstack .title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: white;
  box-sizing: border-box;
  padding: 0 16px;
  display: block;
  color: ${PRIMARY_COLOR};
  cursor: pointer;
}
.ychart-callstack .title:hover {
  opacity: 1;
  text-decoration: underline;
}
.ychart-callstack .tag {
  flex: 0;
  padding: 0 8px;
  height: 18px;
  margin: 0 8px 0 0;
  line-height: 18px;
  text-align: center;
  border-radius: 3px;
  color: white;
  font-size: 12px;
}
.ychart-callstack .tag.combined {
  background: hsl(0, 0%, 77%);
}
.ychart-callstack .tag.async {
  background: hsl(253, 100%, 73%);
}
.ychart-callstack .tag.error {
  background: hsl(0, 93%, 74%);
}
.ychart-callstack a {
  color: hsl(217, 100%, 58%);
  text-decoration: none;
}
.ychart-callstack a:hover {
  text-decoration: underline;
}
`;

export default (container: HTMLElement) => {
  let oldNode = toNode(container);
  
  return (data: CallstackData) => {
    const stackList = flatten<CallstackData>(data);

    const maxDuration = Math.max(...stackList.map((n: CallstackData) => n.elapsedTime + (n.timeOffset || 0)));
    const maxCalibration = maxDuration > SECOND ? maxDuration / SECOND : maxDuration;

    const stack = new Stack(data, maxDuration);
    const shadowItems = flatten<Stack>(stack);
    const newNode = h('div', {
      key: data.spanId,
      attrs: {
        id: container.id,
      },
      class: { 'ychart-callstack': true, },
    }, [
      // 添加公共样式
      h('style', {
        attrs: {
          type: 'text/css',
        },
      }, stylesheet),
      // 添加投影
      h('div', {
        class: { shadow: true, },
      }, shadowItems.slice(1).map((item: Stack) => h('div', {
        attrs: {
          style: `width: ${item.elapsedTimeWidth}; background: ${item.fill}; left: ${item.timeOffsetWidth};`,
        },
        class: { 'shadow-item': true, },
      }))),
      // 添加标尺
      h('div', {
        class: { rule: true, },
      }, Array(6).fill(0).map((_: any, index: number) => 
        h('div', {
          attrs: {
            'data-calibration': `${(index * maxCalibration / 5).toFixed(2)} ${maxDuration > SECOND ? 's': 'ms'}`,
          },
          class: { calibration: true, },
        })
      )),
      // 添加树形组件
      stackList.length > 0 ?
        h('ul', {
          class: { tree: true, root: true, },
        }, stack.render()): null,
    ]);

    oldNode = vPatch(oldNode, newNode);
  };
};