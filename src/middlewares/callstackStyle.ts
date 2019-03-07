/**
 * @module middlewares
 */

import { Stage, PatchBehavior, CallstackData, } from '../@types';
import { createStyle, } from '../components/components';

//Consolas,"Courier New",Courier,FreeMono,monospace

const fontSize = '12px';
const styleSheet = `
/* <![CDATA[ */
text.trace-name {
  font-family: Consolas,"Courier New",Courier,FreeMono,monospace;
  letter-spacing: -.3996px;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;

  fill: #00b3b3;
  font-weight: bold;
  font-size: 14px;
}

text.center {
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
}

text.calibration, text.elapsed-time {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  -webkit-user-select: none;
  user-select: none;
  font-size: 12px;
}
/* ]]> */
`;

export const callstackStyle = (stage: Stage) => (next: PatchBehavior) => (userState?: CallstackData[]) => {
  stage.create(createStyle(styleSheet));

  next(userState);
};
