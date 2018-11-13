import { ServiceNodeOption, Node, } from '../../typings/defines';
import { HEALTH, APDEX, } from '../HEALTH';
import { NODE_TYPE, } from '../NODE_TYPE';

/**
 * Circle 颜色字典
 * @requires HEALTH
 * @desc 
 * HEALTH.HEALTHY #a9d86e
 * HEALTH.NORMAL #86cae4
 */
interface Colours {
  [key: string]: string;
};

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

/**
 * 将Node实例转换为ServiceNodeOption实例
 * @memberof Adapters
 * @param node Node实例
 * @returns ServiceNodeOption实例
 */
export default function createServiceNodeOption (node: Node): ServiceNodeOption {
  return { 
    title: node.showName,
    instances: `${node.activeInstances}/${node.instances}`,
    color: HEALTH_COLOUR[node.health] || APDEX_COLOUR[node.apdex],
    className: `${node.type} ${NODE_TYPE.NODE}`,
    type: node.type,
    elapsedTime: node.elapsedTime,
    rpm: node.rpm,
    epm: node.epm,
    callCount: node.callCount,
    errorCount: node.errorTotalCount || node.error,
    id: node.id,
  };
}