import { identity } from '../FnUtil';

describe('identity()', () => {
  describe.each([1, 2.0, 'ab', { a: 1, x: 'foobar' }])(
    'always returns a given argument: %p',
    (arg) => {
      test(`retuns ${arg}`, () => {
        expect(identity(arg)).toBe(arg);
      });
    }
  );
});

// TODO:uncomment after ts migration
// describe('compose()', () => {
//   describe.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
//     'when %i function(s) given',
//     (i) => {
//       const f = (acc) => (next: string) => `${next}${acc}`;
//       const functions = [...Array(i).keys()].map((x) => {
//         return f(x);
//       });
//       const expected = `${[...Array(i).keys()].reduce(
//         (x, y) => `${y}${x}`,
//         ''
//       )}`;

//       test(`compose ${i} function(s): output ${expected}`, () => {
//         const actual = compose(...functions)('');

//         expect(actual).toEqual(expected);
//       });
//     }
//   );
// });

// describe('pipe()', () => {
//   describe.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
//     'when %i function(s) given',
//     (i) => {
//       const f = (x) => (y: string) => `${x}${y}`;
//       const functions = [...Array(i).keys()].map((x) => {
//         return f(x);
//       });
//       const expected = `${[...Array(i).keys()].reduceRight(
//         (x, y) => `${x}${y}`,
//         ''
//       )}`;

//       test(`chain ${i} function(s): output ${expected}`, () => {
//         const actual = pipe(...functions)('');

//         expect(actual).toEqual(expected);
//       });
//     }
//   );
// });
