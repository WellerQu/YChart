/**
 * 组合子
 */
export default function compose<T> (...funcs: any[]): (...args: any[]) => T {
  if (funcs.length === 0) { return (a: T) => a }

  if (funcs.length === 1) { return funcs[0] }

  return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)));
}
