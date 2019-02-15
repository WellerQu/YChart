import { InstanceAPI, PatchBehavior, TopoData, LineOption, InstanceState, } from '../cores/core';
import io from '../cores/io';
import { setupEventHandler, findGroup, isNotNull, findRoot, parseLinePathD, toArrowPoints, toArrowPathString, distance, motionRun, } from '../utils';
import functor from '../cores/functor';
import maybe from '../cores/maybe';
import { VNode, } from 'snabbdom/vnode';
import { NODE_TYPE, ID_COMBINER, ARROW_HEIGHT, TOPO_OPERATION_STATE, } from '../constants/constants';
import id from '../cores/id';


const getIDProperty = (element: HTMLElement) => element.id;

const getSenderID = (event: MouseEvent) => io(maybe(isNotNull))
  .map(findGroup)
  .fold((f: Function) => f(event))
  .map(getIDProperty)
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

const unRelatedElements = (elements: HTMLElement[]) => (relatedIDs: string[]) => elements
  .filter((item: HTMLElement) => item.id)
  .filter(
    (item: HTMLElement) => !relatedIDs.includes(item.id)
  );

const MIN_OFFSET = ARROW_HEIGHT;
const ARROW_MOTION_STEP = 0.01;

export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState: TopoData) => {
  console.log('loaded relationship middleware'); // eslint-disable-line

  const getLines = getRelatedLines(instance.getStage());
  const getArrows = getRelatedArrows(instance.getStage());

  const destroyMotion: Function[] = [];
  const weakElementSet: Set<HTMLElement> = new Set();

  const handleMouseEnter = (event: MouseEvent) => {
    const state = instance as InstanceState;
    if (state.operation() !== TOPO_OPERATION_STATE.CAN_SHOW_RELATIONSHIP) {
      return;
    }

    const senderID = getSenderID(event);
    const lines = getLines(senderID);
    const arrows = getArrows(senderID);

    const lineIDs = lines.map(getIDProperty);
    const arrowIDs = arrows.map(getIDProperty);
    const nodeIDs = lines
      .map(getIDProperty)
      .map((id: string) => id.replace('line-', ''))
      .map((id: string) => id.split(ID_COMBINER))
      .reduce((arr: Array<string>, item: string[]) => arr.concat(item), []);

    const relatedIDs = [senderID,].concat(lineIDs).concat(arrowIDs).concat(nodeIDs);

    // 无关元素弱化视觉
    functor(unRelatedElements)
      .ap(functor(instance.getStage().children.map((item: VNode) => item.elm)))
      .ap(functor(relatedIDs))
      .fold(id)
      .forEach((item: HTMLElement) => {
        item.classList.add('weak');
        weakElementSet.add(item);
      });

    // 开启箭头动画
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
    // 停止箭头动画
    destroyMotion.forEach(stop => stop());

    // 无关元还原视觉
    Array
      .from(weakElementSet)
      .forEach((item: HTMLElement) => {
        item.classList.remove('weak');
      });
    weakElementSet.clear();
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