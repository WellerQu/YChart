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