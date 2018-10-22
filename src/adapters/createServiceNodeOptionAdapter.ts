import { ServiceNodeOption, Node } from '../../typings/defines';

export default function createServiceNodeOption(node: Node): ServiceNodeOption {
  return { 
    title: node.showName,
    instances: `${node.activeInstances}/${node.instances}`,
    color: 'red',
    className: `${node.type} node`,
    type: node.type,
    avgRT: 0,
    rpm: node.rpm,
    epm: node.epm,
    id: node.id,
  };
}