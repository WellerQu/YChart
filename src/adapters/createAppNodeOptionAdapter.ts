import { Node, AppNodeOption, } from '../@types';
import { NODE_TYPE, } from '../constants/constants';

const title = (node: Node) => {
  const parts: string[] = [];
  parts.push(node.showName);

  if (node.crossApp) {
    // if (node.tierId) {
    //   parts.push(node.tierName);
    // }

    if (node.appId) {
      parts.push(node.appName);
    }
  }

  return parts.join(' @ ');
};

function createAppNodeOption (node: Node): AppNodeOption {
  return {
    title: title(node),
    type: (node.tierId && node.appId) ? NODE_TYPE.INSTANCE : NODE_TYPE.APP,
    className: `${NODE_TYPE.APP} ${NODE_TYPE.NODE}`,
    tierCount: node.tiersCount,
    instances: node.instances,
    id: node.id,
  };
};

export default createAppNodeOption;