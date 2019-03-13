import { VNode, } from 'snabbdom/vnode';
import { h, } from 'snabbdom';
import { INDENT, CALLSTACK_HEIGHT, TEXT_AREA_WIDTH, STACK_SPACE, } from '../constants/constants';
import { CallstackData, } from '../@types';

const OFFSET_X = 10;
const WORD_WIDTH = 8;
const ELLIPSIS_WIDTH = 3 * WORD_WIDTH;
const PADDING_RIGHT = 90;
const PADDING_LEFT = 50;
const FOLD_BUTTON_SIZE = 10;

export default class Stack {
  constructor (data: CallstackData, availableWidth: number, maxDuration: number) {
    this._children = data.children.map(item => {
      const stack = new Stack(item, availableWidth, maxDuration); 
      stack.parentStack = this;

      return stack;
    });
    this._elapsedTime = data.elapsedTime;
    this._fill = data.fill || 'hsl(40, 100%, 63%)';
    this._isFold = false;
    this._timeOffset = data.timeOffset;
    this._title = data.transactionName;
    this._visible = true;
    this._availableWidth = availableWidth;
    this._maxDuration = maxDuration;
    this._id = data.spanId;
  }

  private _id: string;
  private _title: string;
  private _isFold: boolean;
  private _timeOffset: number;
  private _elapsedTime: number;
  private _fill: string;
  private _children: Stack[];
  private _visible: boolean;
  private _availableWidth: number;
  private _maxDuration: number;

  public parentStack: Stack;

  public get elapsedTime () : string {
    if (this._elapsedTime < 1)
      return '< 1 ms';

    return this._elapsedTime + ' ms';
  }

  public get elapsedTimeWidth () : string {
    if (this._elapsedTime < 1)
      return '8px';

    return `${(this._elapsedTime / this._maxDuration * 100) >> 0}%`;
  }
  
  public get fill () : string {
    if (this._elapsedTime < 1)
      return 'gray';

    return this._fill;
  }

  
  public get timeOffset () : string {
    if (this._timeOffset < 0)
      return '0px';

    return `${(this._timeOffset / this._maxDuration * 100) >> 0}%`;
  }
  

  public set visible (v : boolean) {
    this._visible = v;
  }

  public render (): VNode {
    let indentLevel = 0;
    let parent: Stack = this.parentStack;

    while (parent) {
      indentLevel ++;
      parent = parent.parentStack;
    }

    return h('li', {
      attrs: {
        style: `padding-left: ${indentLevel === 0 ? 0 : INDENT}px`,
      },
      class: { node: true, },
    }, [
      h('div', {
        class: { 'data-bar': true, },
      }, [
        // 显示名称
        h('div', {
          attrs: {
            style: `width: ${TEXT_AREA_WIDTH - indentLevel * INDENT}px;`,
          },
        }, [
          h('div', {
            attrs: {
              style: 'max-width: 100%;',
            },
            class: { title: true, },
          }, this._title),
        ]),
        h('div', {
          attrs: {
            style: 'position: relative; flex: 1; box-sizing: border-box;',
          },
        }, [
        // 数据度量条
          h('div', {
            attrs: {
              'data-elapsed-time': this.elapsedTime,
              style: `height: ${CALLSTACK_HEIGHT}px; width: ${this.elapsedTimeWidth}; background: ${this.fill}; left: ${this.timeOffset};`,
            },
            class: { 'elapsed-time': true, },
          }),
        ]),
        // 水平线
        h('div', {
          attrs: {
            style: `left: ${indentLevel === 0 ? 0 : -INDENT}px;`,
          },
          class: { line: true, },
        }),
      ]),
      h('div', {
        class: { 'info-bar': true, },
      }, 'on api-server1'),
      this._children.length > 0 ?
        h('label', {
          attrs: {
            for: this._id,
            style: `left: ${indentLevel * INDENT - 7}px`,
          },
          class: { folder: true, },
        }): null,
      this._children.length > 0 ?
        h('input', {
          attrs: {
            id: this._id,
            type: 'checkbox',
          },
        }): null,
      // 如果没有子元素集合, 就不要渲染ul
      this._children.length > 0 ?
        h('ul', {
          class: { tree: true, },
        }, this._children.map(item => item.render())): null ,
    ]);
  }
}