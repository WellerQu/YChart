import { Node, AppNodeOption, } from '../../typings/defines';
import { NODE_TYPE, } from '../constants/constants';

function createAppNodeOption (node: Node): AppNodeOption {
  return {
    title: node.showName,
    type: 'App',
    className: `app ${NODE_TYPE.NODE}`,
    id: node.id,
  };
};

export default createAppNodeOption;