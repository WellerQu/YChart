import { ServiceNodeOption, Node } from '../../typings/defines';
import { HEALTH } from '../HEALTH';

interface HealthColor {
  [key: string]: string;
}

const HEALTH_COLOR: HealthColor = {
  [HEALTH.HEALTHY]: '#a9d86e',
  [HEALTH.NORMAL]: '#86cae4',
  [HEALTH.INTOLERANCE]: '#f58210',
}

export default function createServiceNodeOption(node: Node): ServiceNodeOption {
  return { 
    title: node.showName,
    instances: `${node.activeInstances}/${node.instances}`,
    color: HEALTH_COLOR[node.health],
    className: `${node.type} node`,
    type: node.type,
    avgRT: node.elapsedTime,
    rpm: node.rpm,
    epm: node.epm,
    id: node.id,
  };
}