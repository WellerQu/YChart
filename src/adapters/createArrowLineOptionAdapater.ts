import { ArrowLineOption, Line, } from '../../typings/defines';

const lineColor = '#2693ff';

export default function createArrowLineOption(line: Line): ArrowLineOption {
  const id = `${line.source}-${line.target}`;

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
    className: 'line',
    text: `${line.elapsedTime} ms`,
  };
}