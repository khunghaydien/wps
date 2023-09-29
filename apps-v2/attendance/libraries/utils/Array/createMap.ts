export default <T>(records: T[]) =>
  <K extends keyof T>(key: K) =>
    new Map<T[K], T>(records.map((value) => [value[key], value]));
