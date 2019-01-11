import { Node, } from '../cores/core';
import { APDEX, HEALTH, } from '../constants/constants';

/**
 * Circle 颜色字典
 * @requires HEALTH
 */
interface Colours {
  [key: string]: string;
};

const MISSING_COLOUR = '#C881FF';

/**
 * 健康度
 * @hidden
 * @see ../HEALTH.ts
 */
const HEALTH_COLOUR: Colours = {
  /**
   * 健康
   */
  [HEALTH.HEALTHY]: '#a9d86e',
  /**
   * 一般
   */
  [HEALTH.NORMAL]: '#86cae4',
  /**
   * 不容忍
   */
  [HEALTH.INTOLERANCE]: '#f58210',
};

/**
 * 性能指数
 * @hidden
 * @see ../HEALTH.ts
 */
const APDEX_COLOUR: Colours = {
  [APDEX.ERROR]: '#f38228',
  [APDEX.NORMAL]: '#aad774',
  [APDEX.SLOW]: '#88cae3',
  [APDEX.VERY_SLOW]: '#fab237',
};

export default (node: Node) => ({
  id: node.id,
  title: node.showName,
  fill: HEALTH_COLOUR[node.health] || APDEX_COLOUR[node.apdex] || MISSING_COLOUR,
  type: node.type,
  activeInstanceCount: node.activeInstances,
  instanceCount: node.instances,
  callCount: node.callCount,
  errorCount: node.errorTotalCount || node.error,
  elapsedTime: node.elapsedTime,
  rpm: node.rpm,
  epm: node.epm,
});