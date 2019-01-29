import { Node, AppNodeOption, } from '../@types';
import { NODE_TYPE, } from '../constants/constants';

function createAppNodeOption (node: Node): AppNodeOption {
  return {
    title: node.showName,
    type: 'App',
    className: `app ${NODE_TYPE.NODE}`,
    tierCount: node.tiersCount,
    instances: node.instances,
    id: node.id,
  };
};

export default createAppNodeOption;