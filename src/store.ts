interface StoreCell<T> {
  expire: number; // Timestamp
  value: T;
}

export default function createStore (storeName: string, max = 100) {
  const name = storeName;
  const store = window.localStorage;

  function write<T> (key: string, value: T): T {
    if (!store)
      return null;

    const keys = Object.keys(store);
    if (keys.length > 100) {
      const now = +new Date;
      keys.forEach((key: string) => {
        const cell = store.getItem(key);
        if (!cell)
          return store.removeItem(key);

        const cellObject = JSON.parse(cell) as StoreCell<any>;
        if (!cellObject || !cellObject.expire)
          return store.removeItem(key);

        if (cellObject.expire > now)
          return store.removeItem(key);
      });
    }

    store.setItem(`${name}_${key}`, JSON.stringify({
      value,
      expire: +new Date + 7 * 24 * 60 * 60 * 1E3,
    }));

    return value;
  }

  function read<T> (key: string): T {
    if (!store)
      return null;

    const storeKey = `${name}_${key}`;
    const cell = store.getItem(storeKey); 

    if (!cell)
      return null;

    const cellObject = JSON.parse(cell) as StoreCell<T>;
    if (!cellObject || !cellObject.expire)
      return null;

    if (cellObject.expire <= +new Date) {
      store.removeItem(storeKey);
      return null;
    }

    return cellObject.value;
  }

  return {
    write,
    read,
  };
};