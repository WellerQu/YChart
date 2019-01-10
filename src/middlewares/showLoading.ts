/**
 * @module middlewares
 */

import { Stage, PatchBehavior, } from '../../typings/defines';
import { createText, createStyle, } from '../components/__components';

const styleSheet = `
text.loading {
  font-family: Verdana,arial,x-locale-body,sans-serif;
  transform: translate(50%, 50%);
  font-size: 24px;
  text-anchor: middle;  /* 文本水平居中 */
  dominant-baseline: middle; /* 文本垂直居中 */
}
`;

// Show a loading in graph center if there's not anything
export const showLoading = (stage: Stage) => (next: PatchBehavior) => (userState?: any) => {
  if (userState)
    return next(userState);

  stage.create(createText({
    x: 0,
    y: 0,
    content: 'Loading...',
    className: 'loading',
  }));
  stage.create(createStyle(styleSheet));

  next(userState);
};

