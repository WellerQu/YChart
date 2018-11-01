import { Stage, PatchBehavior, TopoData, } from '../../typings/defines';

// Motion for the Line in Topo
export const topoMotion = (stage: Stage) => (next: PatchBehavior) => (userState?: TopoData) => {

  // 动画应该由中间件提供
  // pardentNode.children.push(
  //   h(
  //     'animateMotion',
  //     {
  //       attrs: { dur: '3s', repeatCount: 'indefinite', 'xlink:href':`#C${option.id}`, },
  //       ns: 'http://www.w3.org/2000/svg',
  //     },
  //     [
  //       // h('mpath', {
  //       //   attrs: { 'xlink:href': `#P${option.id}` },
  //       //   ns: 'http://www.w3.org/2000/svg'
  //       // })
  //     ]
  //   )
  // );
  next(userState);
};

