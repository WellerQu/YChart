/**
 * @module adapters
 */

import { ArrowLineOption, Line, } from '../../typings/defines';
import { ID_COMBINER, NODE_TYPE, } from '../constants/constants';
import { isNull, isNotNull, } from '../utils';

/**
 * @ignore
 */
const lineColor = '#2693ff';

/**
 * 
 * @ignore
 */
const text = (line: Line) => {
  const parts: string[] = [];

  if (isNotNull(line.elapsedTime)) {
    parts.push(`${line.elapsedTime}ms`);
  }
  if (isNotNull(line.counts)) {
    parts.push(`${line.counts}次`);
  }

  return parts.join(',');
}

/**
 * 将 Line 实例对象转换为 ArrowLineOption 实例
 * @memberof adapters
 * @param line Line 实例对象
 * @returns
 */
function createArrowLineOption (line: Line): ArrowLineOption {
  const id = `${line.source}${ID_COMBINER}${line.target}`;

  return {
    x: 0,
    y: 0,
    fill: lineColor,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    strokeColor: lineColor,
    strokeWidth: 1,
    id,
    className: NODE_TYPE.LINE,
    text: text(line),
  };
}

export default createArrowLineOption;