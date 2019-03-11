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

  fill: hsl(180, 100%, 35%);
  font-weight: 400;
  font-size: 14px;
}

text.trace-name:active {
  fill: hsl(180, 60%, 35%);
}

text.center {
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
}

text.calibration {
  font-size: 10px;
}

text.elapsed-time {
  font-weight: bolder;
}

text.calibration, text.elapsed-time, text.combined {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  -webkit-user-select: none;
  user-select: none;
  font-size: 12px;
}

rect.elapsed-time-bar {
  cursor: pointer;
}
/* ]]> */
`;

export const callstackStyle = (stage: Stage) => (next: PatchBehavior) => (userState?: CallstackData[]) => {
  stage.create(createStyle(styleSheet));

  next(userState);
};
