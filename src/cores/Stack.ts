import { VNode, } from 'snabbdom/vnode';
import { h, } from 'snabbdom';
import { INDENT, CALLSTACK_HEIGHT, TEXT_AREA_WIDTH, } from '../constants/constants';
import { CallstackData, } from '../@types';

export default class Stack {
  constructor (data: CallstackData, maxDuration: number) {
    this._originData = data;
    this._elapsedTime = data.elapsedTime;
    this._fill = data.fill || 'hsl(40, 100%, 63%)';
    this._timeOffset = data.timeOffset;
    this._title = data.transactionName;
    this._maxDuration = maxDuration;
    this._id = data.spanId;
    this._combinedCount = data.combinedCount;
    this._hasError = data.error;
    this._isAsyncCalled = data.asyncCalled;
    this._tierName = data.tierName;
    this._children = [];

    // 合并操作
    for (let i = 0, item = data.children[i]; item; item = data.children[++i]) {
      const subStack = new Stack(item, maxDuration);
      subStack._parentStack = this;

      if (item.combinedCount > 0) {
        subStack._combinedElapsedTime = 
          data.children
            .slice(i, i + item.combinedCount)
            .reduce((sum, item) => sum += item.elapsedTime, 0);

        i += item.combinedCount - 1;
      }

      this._children.push(subStack);
    }
  }

  private _originData: CallstackData;
  private _hasError: boolean;
  private _isAsyncCalled: boolean;
  private _tierName: string;
  private _id: string;
  private _title: string;
  private _timeOffset: number;
  private _elapsedTime: number;
  private _fill: string;
  private _children: Stack[];
  private _maxDuration: number;
  private _combinedCount: number;
  private _combinedElapsedTime: number;
  private _parentStack: Stack;

  public get children () : Stack[] {
    return this._children || [];
  }

  public get elapsedTime () : string {
    if (this._elapsedTime < 1)
      return '< 1 ms';

    return (this._combinedElapsedTime || this._elapsedTime) + ' ms';
  }

  public get elapsedTimeWidth () : string {
    if (this._elapsedTime < 1)
      return '8px';

    return `${((this._combinedElapsedTime || this._elapsedTime) / this._maxDuration * 100) >> 0}%`;
  }
  
  public get fill () : string {
    if (this._elapsedTime < 1)
      return 'hsl(206, 9%, 85%)'; // 浅灰色

    return this._fill;
  }

  public get timeOffsetWidth () : string {
    if (this._timeOffset < 0)
      return '0px';

    return `${(this._timeOffset / this._maxDuration * 100) >> 0}%`;
  }
  
  public get title () : string {
    return this._title;
  }

  private handleSelectItemChange = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    let parentElement = target.parentElement;

    while (parentElement && parentElement.classList) {
      if (parentElement.classList.contains('callstack')) {
        break;
      }

      parentElement = parentElement.parentElement;
    }

    if (!parentElement) {
      return;
    }

    const HIGH_LIGHT_CLASS_NAME = 'highlight';
    const EVENT_NAME = 'stackclick';
    const selectables = Array.from(parentElement.querySelectorAll('.selectable'));

    selectables.forEach((item: HTMLElement) => {
      if (item.id === this._id && !item.classList.contains(HIGH_LIGHT_CLASS_NAME)) {
        item.classList.add(HIGH_LIGHT_CLASS_NAME);
        parentElement.dispatchEvent(new CustomEvent(EVENT_NAME, {
          detail: this._originData,
        }));
      } else if (item.classList.contains(HIGH_LIGHT_CLASS_NAME)) {
        item.classList.remove(HIGH_LIGHT_CLASS_NAME);
        parentElement.dispatchEvent(new CustomEvent(EVENT_NAME, {
          detail: null,
        }));
      }
    });
  }
  
  public render (): VNode {
    let indentLevel = 0;
    let parent: Stack = this._parentStack;

    while (parent) {
      indentLevel ++;
      parent = parent._parentStack;
    }

    return h('li', {
      attrs: {
        style: `padding-left: ${indentLevel === 0 ? 0 : INDENT}px`,
      },
      class: { node: true, },
    }, [
      // 背景高亮作为选中反馈
      h('div', {
        attrs: {
          id: this._id,
        },
        class: { selectable: true, },
      }, [
        h('div', {
          class: { 'data-bar': true, },
        }, [
          h('div', {
            attrs: {
              style: `width: ${TEXT_AREA_WIDTH - indentLevel * INDENT}px; display: flex;`,
            },
          }, [
            // 显示名称
            h('div', {
              attrs: {
                style: 'max-width: 100%;',
                title: this.title,
              },
              class: { title: true, },
              on: {
                click: this.handleSelectItemChange,
              },
            }, this.title),
            // 合并批处理
            this._combinedElapsedTime ?
              h('div', {
                attrs: {
                  title: 'batch calls',
                },
                class: { combined: true, tag: true, },
              }, this._combinedCount): null,
            // 标记为异步调用
            this._isAsyncCalled ? 
              h('div', {
                attrs: {
                  title: 'asynchronous call',
                },
                class: { async: true, tag: true, },
              }, 'A'): null,
            // 标记为有错误调用
            this._hasError ?
              h('div', {
                attrs: {
                  title: 'error call',
                },
                class: { error: true, tag: true, },
              }, 'E'): null,
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
                style: `height: ${CALLSTACK_HEIGHT}px; width: ${this.elapsedTimeWidth}; background: ${this.fill}; left: ${this.timeOffsetWidth};`,
              },
              class: { 'elapsed-time': true, },
              on: {
                click: this.handleSelectItemChange,
              },
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
        }, [
          h('span', {}, 'on '),
          h('a', {
            attrs: {
              title: this._tierName,
              href: 'javascript: void(0)',
            },
          }, this._tierName),
        ]),
      ]),
      // 可折叠按钮
      this._children.length > 0 ?
        h('label', {
          attrs: {
            title: '点击展开/折叠',
            for: `folder-${this._id}`,
            style: `left: ${indentLevel * INDENT - 7}px`,
          },
          class: { folder: true, },
        }): null,
      // 控制折叠/展开状态的关键
      this._children.length > 0 ?
        h('input', {
          attrs: {
            id: `folder-${this._id}`,
            type: 'checkbox',
          },
        }): null,
      // 如果没有子元素集合, 就不要渲染ul
      this._children.length > 0 ?
        h('ul', {
          class: { tree: true, },
        }, this._children.map(item => item.render())): null ,
      h('i', {
        attrs: {
          style: `left: ${indentLevel * INDENT - 6}px`,
        },
        class: { plus: true, },
      }),
      h('i', {
        attrs: {
          style: `left: ${indentLevel * INDENT - 6}px`,
        },
        class: { reduce: true, },
      }),
    ]);
  }
}