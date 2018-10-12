import { TopoData, } from '../../typings/defines';

import compose from '../compose';
import clone from '../clone';

enum NodeType {
  USER = 'USER',
  SERVER = 'SERVER ',
  DATABASE = 'DATABASE',
  NOSQL = 'NOSQL',
  HTTP = 'HTTP',
  RPC = 'RPC',
  MQ = 'MQ'
}

const mergeUsers = (data: TopoData): TopoData => {
  return {
    ...data
  };
};

const mergeHTTPOrRPC = (data: TopoData): TopoData => {
  return {
    ...data
  };
};

export default compose<TopoData>(
  mergeUsers,
  mergeHTTPOrRPC,
  (data: TopoData): TopoData => {
    return data;
  },
  clone
);
