import toNode from "../node_modules/snabbdom/tovnode";
import { SubscriberFn, UpdateFn, TopoData, Stage, Node, Line } from "../typings/defines";

import compose from "./compose";
import { log } from "./middlewares/log";
import { event } from "./middlewares/event";
import { layout } from "./middlewares/layout";
import { style } from "./middlewares/style";

import applyMiddlewares from "./applyMiddlewares";
import createStage from "./createStage";

import { createImageNode } from "./components/createImageNode";
import { createArrowLine } from "./components/createArrowLine";
import { createServerNode } from "./components/createServerNode";
import { createServiceNode } from "./components/createServiceNode";

import createImageNodeAapter from "./adapters/createImageNodeAapter";

const imageNode = compose(
  createImageNode,
  createImageNodeAapter,
);

// Entrance, start from here
export default (container: HTMLDivElement, updated?: SubscriberFn): UpdateFn => {
  const enhancer = applyMiddlewares(log, event, layout, style);
  const createStageAt = compose<Stage>(
    enhancer(createStage),
    toNode,
  );
  const { create, subscribe, patch } = createStageAt(container);

  updated && subscribe(updated);

  patch();

  // update
  return (data: TopoData): void => {

    data.nodes.forEach((item: Node) => {

    });

    data.links.forEach((item: Line) => {

    });

    patch(data);
  }
} 