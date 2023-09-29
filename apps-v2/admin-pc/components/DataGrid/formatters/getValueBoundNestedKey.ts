type NestedValue = {
  [key: string]: NestedValue;
};

const getValueBoundNestedKey =
  (key: string) =>
  ({
    value,
  }: {
    value: {
      [key: string]: NestedValue;
    };
  }): any => {
    const keys = key.split('.');
    const result = keys.reduce((obj, aKey) => obj && obj[aKey], value);
    // @ts-ignore
    return result === 0 ? 0 : result || '';
  };

export default getValueBoundNestedKey;
