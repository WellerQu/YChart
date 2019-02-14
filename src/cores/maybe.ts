import right from "./right";
import left from "./left";

const maybe = (predicate: (x: any) => boolean) => (x: any) => predicate(x) ? right(x) : left(x);

export default maybe;
