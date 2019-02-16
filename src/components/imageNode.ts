import functor from '../cores/functor';
import { circle, image, text, } from './components';
import { IMAGE_ROOT, } from '../constants/constants';

interface NodeOption {
  URL: string;
  id: string;
  title: string;
}

const imageNode = (option: NodeOption) => functor(option)
  .map(( option: NodeOption ) => [
    circle({ x: 70, y: 70, radius: 35, fill: '#EFEFEF', }),
    image({ URL: `${IMAGE_ROOT}/${option.URL}`, x: 45, y: 45, width: 50, height: 50, }),
    text({ content: option.title, x: 70, y: 120, className: { 'node-name': true, }, }),
  ]);

export default imageNode;