declare module 'randomcolor' {
  export interface OptionForOneColor {
    hue?: string;
    luminosity?: string;
    format?: string;
    alpha?: number;
    seed?: number | string;
  }

  export interface OptionForMoreColors extends OptionForOneColor {
    count: number;
  }

  function randomColor(option?: OptionForOneColor): string;
  function randomColor(option?: OptionForMoreColors): string[];

  export default randomColor;
}