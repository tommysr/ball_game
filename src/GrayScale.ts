export default function GrayScale<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    colors = [
      "#DCDCDC",
      "#C0C0C0",
      "#A9A9A9",
      "#707070",
      "#505050",
      "#282828",
      "#000000",
    ];
  };
}
