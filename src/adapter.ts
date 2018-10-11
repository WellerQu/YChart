import { ImageNodeOption } from "../typings/defines";

export namespace adapter {
  export const imageNodeDataAdapter = (x: any): ImageNodeOption => {
    return {
      title: x.a,
      URL: x.symbol,
      tag: "customer-classes",
    }
  }
}