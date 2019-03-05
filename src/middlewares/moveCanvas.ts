import { InstanceAPI, PatchBehavior, TopoData, Functor, Position, InstanceState, } from '../cores/core';
import io from '../cores/io';
import { setupEventHandler, } from '../utils';
import functor from '../cores/functor';
import { TOPO_OPERATION_STATE, } from '../constants/constants';
import id from '../cores/id';

const clickPosition = (event: MouseEvent) => functor(event)
  .map((event: MouseEvent) => ({x: event.pageX, y: event.pageY, }));

const diffPosition = (p1: Position) => (p2: Position) => ({
  x: p1.x - p2.x,
  y: p1.y - p2.y,
});

const getNewPosition = (startPosition: Position) => (diffPosition: Position) => (ratio: number): Position => {
  return {
    x: startPosition.x + diffPosition.x * ratio,
    y: startPosition.y + diffPosition.y * ratio,
  };
};

export default (instance: InstanceAPI) => (next: PatchBehavior) => (userState: TopoData) => {
  // 是否已开始拖拽
  let isReadyToMove = false;
  // 鼠标点击开始拖拽的坐标函子
  let startPosition$: Functor = null;
  // 鼠标点击时的viewbox
  let sourcePosition$: Functor = null;
  // 比例函子
  let ratio$: Functor = null;

  const handleMouseDown = (event: MouseEvent) => {
    const state = instance as InstanceState;
    if (state.operation() !== TOPO_OPERATION_STATE.CAN_MOVE_CANVAS) {
      return;
    }

    isReadyToMove = true;
    ratio$ = functor(instance)
      .map((ins: InstanceAPI) => [ins.viewbox()[2], ins.size().width,])
      .map(([viewBoxWidth, sizeWidth,]: [number, number]) => viewBoxWidth / sizeWidth)
      // 需要向相反方向移动
      .map((ratio: number) => ratio * -1);
    startPosition$ = clickPosition(event);
    sourcePosition$ = functor(instance.viewbox()).map(([x, y,]: [number, number]) => ({ x, y, }));
  };
  const handleMouseMove = (event: MouseEvent) => {
    if (!isReadyToMove)
      return;

    const diff$ = functor(diffPosition)
      .ap(clickPosition(event))
      .ap(startPosition$);

    const newPosition = functor(getNewPosition)
      .ap(sourcePosition$)
      .ap(diff$)
      .ap(ratio$)
      .fold(id);

    const [x,y,width, height,] = instance.viewbox();
    instance.viewbox([newPosition.x, newPosition.y, width, height,]);
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