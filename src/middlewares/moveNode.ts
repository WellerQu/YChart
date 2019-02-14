import { InstanceAPI, PatchBehavior, TopoData, InstanceState, Position, Functor, LineOption, } from "../cores/core";
import { setupEventHandler, findGroup, parseTranslate, toTranslate, findRoot, parseLinePathD, toLinePathD, toArrowPoints, distance } from "../utils";
import functor from "../cores/functor";
import io from "../cores/io";
import { TOPO_OPERATION_STATE, ID_COMBINER, NODE_SIZE, MIN_NODE_DISTANCE } from "../constants/constants";
import id from "../cores/id";
import sideEffect from "../cores/sideEffect";

const clickPosition = (event: MouseEvent) => functor(event)
  .map((event: MouseEvent) => ({x: event.pageX, y: event.pageY, }));

const diffPosition = (p1: Position) => (p2: Position) => ({
  x: p1.x - p2.x,
  y: p1.y - p2.y,
});

const getNewPosition = (sourcePosition: Position) => (diffPosition: Position) => (ratio: number) => {
  return {
    x: sourcePosition.x + diffPosition.x * ratio,
    y: sourcePosition.y + diffPosition.y * ratio,
  };
};

const findElement = (prefix: string) => (id: string) => (elements: HTMLElement[]) => 
  elements
    .filter(item => item.id.startsWith(prefix))
    .filter(item => item.id
      .replace(prefix, '')
      .split(ID_COMBINER)
      .find((n: string) => n === id) !== void 0);
const findLines = findElement('line-');
const findArrows = findElement('arrow-');

const toLineOption = (id: string) => (newPosition: Position) => (element: HTMLElement): LineOption => {
  const pathD = parseLinePathD(element.getAttribute('d'));
  if (pathD === null) {
    return null;
  }

  const [sourceID, targetID,] = element.id.replace('line-', '').split(ID_COMBINER);
  if (id !== sourceID && id !== targetID) {
    return null;
  }

  const [source, target, ] = pathD;
  if (sourceID === id) {
    return {
      id: `${sourceID}${ID_COMBINER}${targetID}`,
      source: {
        x: newPosition.x + NODE_SIZE / 2,
        y: newPosition.y + NODE_SIZE / 2,
      },
      target,
    };
  } else {
    return {
      id: `${sourceID}${ID_COMBINER}${targetID}`,
      source,
      target: {
        x: newPosition.x + NODE_SIZE / 2,
        y: newPosition.y + NODE_SIZE / 2,
      },
    };
  }
};

export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState: TopoData) => {
  if (!userState)
    return next(userState);

  // 是否已开始拖拽
  let isReadyToMove = false;
  // 正在被拖拽的元素
  let $movingElement: HTMLElement = null;
  // 元素原始位置函子
  let sourcePosition$: Functor = null;
  // 鼠标点击开始拖拽的坐标函子
  let startPosition$: Functor = null;
  // 比例函子
  let ratio$: Functor = null;
  
  const handleMouseDown = (event: MouseEvent) => {
    const state = instance as InstanceState;
    if (state.operation() !== TOPO_OPERATION_STATE.CAN_MOVE_NODE) {
      return;
    }

    $movingElement = findGroup(event);
    if (!$movingElement) {
      return;
    }

    isReadyToMove = true;
    ratio$ = functor(instance)
      .map((ins: InstanceAPI) => [ins.viewbox()[2], ins.size().width])
      .map(([viewBoxWidth, sizeWidth]: [number, number]) => viewBoxWidth / sizeWidth);
    startPosition$ = clickPosition(event);
    sourcePosition$ = functor($movingElement)
      .map(($elem: HTMLElement) => $elem.style.transform)
      .map(parseTranslate);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isReadyToMove)
      return;

    const diff$ = functor(diffPosition)
      .ap(clickPosition(event))
      .ap(startPosition$);

    const newPosition$ = functor(getNewPosition)
      .ap(sourcePosition$)
      .ap(diff$)
      .ap(ratio$);
    
    const children$ = functor(event).map(findRoot)
      .map(($elem: HTMLElement) => $elem.children)
      .map(($children: HTMLCollection) => Array.from($children));

    const lines$ = children$.map(findLines($movingElement.id));
    const arrows$ = children$.map(findArrows($movingElement.id));

    // 更新节点坐标
    $movingElement.style.transform = newPosition$.map(toTranslate).fold(id);
    // 更新线段坐标 & 更新箭头坐标
    const options = lines$
      .map(($elements: HTMLElement[]) =>  
        $elements.map((item: HTMLElement) => 
          functor(toLineOption)
            .ap(functor($movingElement.id))
            .ap(newPosition$)
            .ap(functor(item))
            .map((option: LineOption) => (f: Function) => f(option))
        ))
      .fold(id);

    lines$.fold(id).forEach(
      (item: HTMLElement, index: number) => 
        options[index]
          .ap(functor(toLinePathD))
          .chain((d: string) => sideEffect(() => item.setAttribute('d', d)))
          .fold(id)
    );

    arrows$.fold(id).forEach((item: HTMLElement, index: number) => {
      options[index]
        .ap(functor(toArrowPoints))
        .map(([p1, p2, p3,]: [Position, Position, Position]) => `M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y} z`)
        .chain((d: string) => sideEffect(() => item.setAttribute('d', d)))
        .fold(id);

      options[index]
        .ap(functor((option: LineOption) => distance(option.source)(option.target) < MIN_NODE_DISTANCE))
        .chain((really: boolean) => sideEffect(() => item.setAttribute('opacity', really ? 0 : 1)))
        .fold(id);
    });
  };

  const handleMouseUp = (_: MouseEvent) => {
    isReadyToMove = false;
  };

  // 绑定拖拽相关的事件
  io(
    setupEventHandler(handleMouseDown)('mousedown')
  ).map(
    setupEventHandler(handleMouseMove)('mousemove')
  ).map(
    setupEventHandler(handleMouseUp)('mouseup')
  ).ap(functor(instance.getStage()));

  return next(userState);
};