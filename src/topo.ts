import toNode from "../node_modules/snabbdom/tovnode";
import { SubscriberFn, TopoData, Stage } from "../typings/defines";

import compose from "./compose";
import { log } from "./middlewares/log";
import { event } from "./middlewares/event";
import { layout } from "./middlewares/layout";
import { style } from "./middlewares/style";

import applyMiddlewares from "./applyMiddlewares";
import createStage from "./createStage";

import { createImageNode } from "./components/createImageNode";

// Entrance, start from here
export default (container: HTMLDivElement, updated?: SubscriberFn) => {
  const enhancer = applyMiddlewares(log, event, layout, style);
  const createStageAt = compose<Stage>(
    enhancer(createStage),
    toNode,
  );
  const { create, subscribe, patch } = createStageAt(container);

  updated && subscribe(updated);

  // update
  return (data: TopoData): void => {

    // create(composed.createServiceNode({ title: "redisService", type: "Java", avgRT: "204.92ms", rpm: "10.4rpm", instances: "1/1", color: "#a9d86e", tag: "service-node" }));
    // create(composed.createServerNode({ title: "server 1", instances: "2/1", color: "#fab421", tag: "server-node" }));
    // create(composed.createArrowLine({ x1: 100, y1: 100, x2: 500, y2: 300, strokeColor: "#2693ff", strokeWidth: 1, x: 100, y: 100, fill: "#2693ff", tag: "link-line0" }));
    // create(composed.createArrowLine({ x1: 100, y1: 300, x2: 500, y2: 300, strokeColor: "#2693ff", strokeWidth: 1, x: 100, y: 100, fill: "#2693ff", tag: "link-line1" }));
    create(createImageNode({ URL: "user.png", title: "用户", tag: "user-node", }))

    patch(data);
  }
} 