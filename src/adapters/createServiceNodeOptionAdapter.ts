import { ServiceNodeOption, Node } from '../../typings/defines';
import { HEALTH, APDEX } from '../HEALTH';
import { NODE_TYPE } from '../NODE_TYPE';

interface DataColor {
  [key: string]: string;
}

const HEALTH_COLOR: DataColor = {
  [HEALTH.HEALTHY]: '#a9d86e',
  [HEALTH.NORMAL]: '#86cae4',
  [HEALTH.INTOLERANCE]: '#f58210',
};

const APDEX_COLOR: DataColor = {
  [APDEX.ERROR]: '#f38228',
  [APDEX.NORMAL]: '#aad774',
  [APDEX.SLOW]: '#88cae3',
  [APDEX.VERY_SLOW]: '#fab237',
};

export default function createServiceNodeOption(node: Node): ServiceNodeOption {
  return { 
    title: node.showName,
    instances: `${node.activeInstances}/${node.instances}`,
    color: HEALTH_COLOR[node.health] || APDEX_COLOR[node.apdex],
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