import { ImageNodeOption } from '../../typings/defines';

export default (data: any): ImageNodeOption => {
  return {
    URL: data.smallType,
    title: ''
  };
};
