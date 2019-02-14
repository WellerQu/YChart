import { InstanceAPI, PatchBehavior, TopoData, LineOption, } from '../cores/core';
import io from '../cores/io';
import { setupEventHandler, findGroup, isNotNull, findRoot, parseLinePathD, toArrowPoints, toArrowPathString, distance, motionRun, } from '../utils';
import functor from '../cores/functor';
import maybe from '../cores/maybe';
import { VNode, } from 'snabbdom/vnode';
import { NODE_TYPE, ID_COMBINER, ARROW_HEIGHT, } from '../constants/constants';
import id from '../cores/id';

const getSenderID = (event: MouseEvent) => io(maybe(isNotNull))
  .map(findGroup)
  .fold((f: Function) => f(event))
  .map((elem: HTMLElement) => elem.id)
  .fold(null, id);

const getRelatedLines = ($stage: VNode) => (senderID: string) => $stage.children.filter(
  (item: VNode) => item.data.key && item.sel === 'path'
).filter(
  (item: VNode) => (item.data.key as string).startsWith('line-')
).filter(
  (item: VNode) => (item.data.key as string)
    .replace('line-', '')
    .split(ID_COMBINER)
    .find((id: string) => id === senderID) !== void 0
).map(
  (item: VNode) => item.elm
);

const getRelatedArrows = ($stage: VNode) => (senderID: string) => $stage.children.filter(
  (item: VNode) => item.data.key && item.sel === 'path'
).filter(
  (item: VNode) => (item.data.key as string).startsWith('arrow-')
).filter(
  (item: VNode) => (item.data.key as string)
    .replace('arrow-', '')
    .split(ID_COMBINER)
    .find((id: string) => id === senderID) !== void 0
).map(
  (item: VNode) => item.elm
);

const getRelatedNodes = ($stage: VNode) => (nodeIDs: string[]) => $stage.children.filter(
  (item: VNode) => item.data.class
).filter(
  (item: VNode) => item.data.class[NODE_TYPE.NODE]
).filter(
  (item: VNode) => nodeIDs.includes(item.data.key as string)
).map(
  (item: VNode) => item.elm
);

const toLineOption = (element: HTMLElement): LineOption => {
  const pathD = parseLinePathD(element.getAttribute('d'));

  if (pathD === null) {
    return null;
  }

  const [sourceID, targetID,] = element.id.replace('line-', '').split(ID_COMBINER);
  const [source, target,] = pathD;

  return {
    id: `${sourceID}${ID_COMBINER}${targetID}`,
    source,
    target,
  };
};

const MIN_OFFSET = ARROW_HEIGHT;
const ARROW_MOTION_STEP = 0.01;

export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState: TopoData) => {
  console.log('loaded relationship middleware'); // eslint-disable-line

  const getLines = getRelatedLines(instance.getStage());
  const getArrows = getRelatedArrows(instance.getStage());

  let destroyMotion: Function[] = [];

  const handleMouseEnter = (event: MouseEvent) => {
    const senderID = getSenderID(event);
    const lines = getLines(senderID);
    const arrows = getArrows(senderID);

    lines
      .map(toLineOption)
      .forEach((option: LineOption, index: number) => {
        const stop = motionRun(
          arrows[index] as HTMLElement,
          (arrowPath: HTMLElement, step: number) => {
            // | length                             |
            // | 10|                            | 10|
            // |---<----------------------------<---|
            const length = distance(option.source)(option.target);
            const points = toArrowPoints(option, ARROW_HEIGHT + length * step * ARROW_MOTION_STEP);
            const balance = distance(points[0])(option.target);

            arrowPath.setAttribute('d', toArrowPathString(points));

            // 是否还有下一帧, true有, false没有
            return balance > MIN_OFFSET;
          },
          (arrowPath: HTMLElement) => {
            arrowPath.setAttribute('d', toArrowPathString(toArrowPoints(option)));
          },
          true,
        );

        destroyMotion.push(stop);
      });
  };
  const handleMouseLeave = (event: MouseEvent) => {
    destroyMotion.forEach(stop => stop());
  };

  const setup$ = io(
    setupEventHandler(handleMouseEnter)('mouseenter')
  ).map(
    setupEventHandler(handleMouseLeave)('mouseleave')
  );

  instance.getStage().children
    .filter((item: VNode) => item.data.class)
    .filter((item: VNode) => item.data.class[NODE_TYPE.NODE])
    .map(functor)
    .forEach(setup$.ap);

  return next(userState);
};