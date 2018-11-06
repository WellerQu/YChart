const store = window.localStorage;

export default function createStore (storeName: string, max = 100) {
  const name = storeName;

  function write<T> (key: string, value: T): T {
    if (!store)
      return null;

    store.setItem(`${name}_${key}`, JSON.stringify(value));

    return value;
  }

  function read<T> (key: string): T {
    if (!store)
      return null;

    const value = store.getItem(`${name}_${key}`); 

    if (!value)
      return null;

    return JSON.parse(value);
  }

  return {
    write,
    read,
  };
};