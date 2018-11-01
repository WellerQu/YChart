import { Stage, PatchBehavior, CallstackData, } from '../../typings/defines';
import { createStyle, } from '../components/components';

const fontSize = '8px';
const styleSheet = `
/* <![CDATA[ */
g.group
, text.calibration {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  letter-spacing: -.3996px;
  cursor: pointer;
  user-select: none;

  will-change: z-index, transform, opacity;
}

g.group.callstack:hover > rect {
  opacity: 0.6;
}

g.group.callstack > text:nth-child(2) {
  stroke: hsl(0, 0%, 100%);
  stroke-width: 2px;
}

g.group.callstack > text.callstack-desc {
  font-size: ${fontSize};
}

text.calibration {
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
  font-size: ${fontSize};
  user-select: none;
  pointer-event: none;
}
/* ]]> */
`;

export const callstackStyle = (stage: Stage) => (next: PatchBehavior) => (userState?: CallstackData[]) => {
  stage.create(createStyle(styleSheet));

  next(userState);
};
