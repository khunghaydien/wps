/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

const compare = (a: any, b: any): boolean => {
  if (a === null || b === null) {
    return a === b;
  } else if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((_, idx) => compare(a[idx], b[idx]))
    );
  } else if (typeof a === 'object') {
    return (
      typeof b === 'object' &&
      Object.keys(a).length === Object.keys(b).length &&
      Object.keys(a).every(
        (key) => key in a && key in b && compare(a[key], b[key])
      )
    );
  } else {
    return a === b;
  }
};

export default compare;
