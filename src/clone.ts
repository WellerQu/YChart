export default function clone<T> (target: T): T {
  return JSON.parse(JSON.stringify(target));
}
