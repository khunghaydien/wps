type Action<T> = T extends object
  ? {
      [K in keyof T]: ReturnType<T[K]>;
    }[keyof T]
  : never;
