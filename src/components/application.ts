import { text, circle, group, appendTo, } from './components';
import functor from '../cores/functor';
import { ApplicationOption, } from '../cores/core';
import id from '../cores/id';
import { VNode, } from 'snabbdom/vnode';

import { isNull, } from '../utils';
import left from '../cores/left';
import right from '../cores/right';

const hasTierCount = (option: ApplicationOption) => (nodes: VNode[]) =>
  isNull(option.tierCount) ? left(nodes) : right(nodes);
const hasInstanceCount = (option: ApplicationOption) => (nodes: VNode[]) =>
  isNull(option.instancesCount) ? left(nodes) : right(nodes);

const application = (option: ApplicationOption) =>
  functor(option)
    .map((option: ApplicationOption) => [
      circle({ x: 35 + 15, y: 35 + 24, radius: 35, fill: '#FFFFFF', }),
      circle({ x: 35 + 15, y: 35 + 24, radius: 35, fill: '#CC99CC', }),
      circle({ x: 35 + 15, y: 35 + 24, radius: 32, fill: '#FFFFFF', }),
      circle({ x: 35 + 15, y: 35 + 24, radius: 30, fill: '#CC99CC', }),
      text({ content: option.title, x: 35 + 15, y: 90 + 24, }),
      text({ content: 'Application', x: 35 + 15, y: 35 + 24, }),
    ])
    .chain(hasTierCount(option))
    .map((nodes: VNode[]) =>
      nodes.concat([
        text({ content: `${option.tierCount} tiers`, x: 82 + 15, y: 36 + 24, }),
      ])
    )
    .chain(hasInstanceCount(option))
    .map((nodes: VNode[]) =>
      nodes.concat([
        text({
          content: `${option.instancesCount} instances`,
          x: 82 + 15,
          y: 48 + 24,
        }),
      ])
    )
    .chain(functor.of)
    .map((nodes: VNode[]) =>
      group(
        { id: option.id, x: 0, y: 0, className: { application: true, }, },
        nodes
      )
    )
    .map(appendTo)
    .fold(id);

application.of = (option: ApplicationOption) => application(option);

export default application;