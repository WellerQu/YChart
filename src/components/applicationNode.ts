import { text, circle, group, appendTo, image, } from './components';
import functor from '../cores/functor';
import { ApplicationOption, } from '../cores/core';
import id from '../cores/id';
import { VNode, } from 'snabbdom/vnode';

import { isNull, } from '../utils';
import left from '../cores/left';
import right from '../cores/right';
import { NODE_TYPE, } from '../constants/constants';
import imageNode from './imageNode';

const hasTierCount = (option: ApplicationOption) => (nodes: VNode[]) =>
  isNull(option.tierCount) ? left(nodes) : right(nodes);
const hasInstanceCount = (option: ApplicationOption) => (nodes: VNode[]) =>
  isNull(option.instancesCount) ? left(nodes) : right(nodes);

const application = (option: ApplicationOption) =>
  imageNode({
    ...option,
    URL: 'application.png',
  })
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
        {
          id: option.id,
          x: 0, y: 0,
          className: {
            [NODE_TYPE.NODE]: true,
            [NODE_TYPE.APP]: true,
          },
        },
        nodes
      )
    )
    .map(appendTo)
    .fold(id);

application.of = (option: ApplicationOption) => application(option);

export default application;