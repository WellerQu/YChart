import { Node, AppNodeOption, } from '../@types';
import { NODE_TYPE, } from '../constants/constants';

const title = (node: Node) => {
  const parts: string[] = [];

  if (node.crossApp) {
    if (node.appId) {
      parts.push(node.appName);
    }

    if (node.tierId) {
      parts.push(node.tierName);
    }
  }

  parts.push(node.showName);

  return parts.join(' - ');
};

function createAppNodeOption (node: Node): AppNodeOption {
  return {
    title: title(node),
    type: 'App',
    className: `app ${NODE_TYPE.NODE}`,
    tierCount: node.tiersCount,
    instances: node.instances,
    id: node.id,
  };
};

export default createAppNodeOption;