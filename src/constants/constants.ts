/**
 * @module constants
 */

/**
 * 绘制topo图时每个节点的长宽
 */
export const NODE_SIZE = 140;

/**
 * 采用GroupLayout布局策略时每个网格的长宽
 */
export const CELL_SIZE = 300;

/**
 * 拓扑图中箭头在线段上与相关节点的距离
 */
export const ARROW_OFFSET = 100; // 箭头距离图表原点

/**
 * 拓扑图中箭头的高
 */
export const ARROW_HEIGHT = 10;

/**
 * 拓扑图中箭头的底边宽
 */
export const ARROW_WIDTH = 6;

/**
 * 调用栈图中的每个调用栈的高
 */
export const CALLSTACK_HEIGHT = 6;

/**
 * 调用栈间隙高度
 */
export const STACK_SPACE = 30;

/**
 * 调用栈缩进
 */
export const INDENT = 40;

/**
 * 调用栈图中标尺左右补白
 */
export const RULE_PADDING = 20; // 标尺左右补白

export const TEXT_AREA_WIDTH = 400;

/**
 * 标尺的高
 */
export const RULE_HEIGHT = 45;

/**
 * 标尺的步长
 */
export const MAX_RULE_STEP = 500;

/**
 * 合成ID时的拼接符
 */
export const ID_COMBINER = '-to-';

/**
 * 健康度枚举
 */
export enum HEALTH {
  /**
   * 一般
   */
  NORMAL = 'NORMAL',
  /**
   * 容忍
   */
  INTOLERANCE = 'INTOLERANCE',
  /**
   * 健康
   */
  HEALTHY = 'HEALTHY',
}

/**
 * 性能指数枚举
 */
export enum APDEX {
  /**
   * 缓慢
   */
  SLOW = 'SLOW',
  /**
   * 非常慢
   */
  VERY_SLOW = 'VERY_SLOW',
  /**
   * 错误
   */
  ERROR = 'ERROR',
  /**
   * 正常
   */
  NORMAL = 'NORMAL',
}

/**
 * Topo 图中的节点类型枚举
 */
export enum NODE_TYPE {
  // 内部定义
  LINE = 'line',
  NODE = 'node',
  APP = 'app',
  INSTANCE = 'instance',
  CROSS_APP = 'cross-app',
  CALL_STACK = 'callstack',

  // 外部定义
  USER = 'USER',
  SERVER = 'SERVER',
  DATABASE = 'DATABASE',
  NOSQL = 'NOSQL',
  HTTP = 'HTTP',
  RPC = 'RPC',
  MQ = 'MQ',
}

/**
 * 数据库类型枚举
 */
export enum DATABASE_TYPE {
  KAFKA_PRODUCER = 'kafkaProducer',
  KAFKA_CONSUMER = 'kafkaConsumer',
  REDIS = 'redis',
  MYSQL = 'mysql',
}

export enum TOPO_OPERATION_STATE {
  NONE = 0,
  CAN_MOVE_NODE = 1,
  CAN_MOVE_CANVAS = 2,
  CAN_SHOW_RELATIONSHIP = 3,
}