import { Node, ApplicationOption, } from '../cores/core';

export default (node: Node): ApplicationOption => ({
  id: node.id,
  title: node.showName,
  icon: 'application',
  tierCount: node.tiersCount,
  instancesCount: node.activeInstances,
});