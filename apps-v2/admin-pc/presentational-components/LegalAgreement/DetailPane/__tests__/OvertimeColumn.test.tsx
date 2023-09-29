import {
  // @ts-ignore
  __get__,
} from '../OvertimeColumn';

describe('isChange()', () => {
  it.each`
    arr           | expected
    ${null}       | ${false}
    ${undefined}  | ${false}
    ${[]}         | ${false}
    ${['']}       | ${false}
    ${['a', 'b']} | ${true}
  `('should be $expected if argument is $arr', ({ arr, expected }) => {
    expect(__get__('isChange')(arr)).toBe(expected);
  });
});

describe('join()', () => {
  it.each`
    arr           | expected
    ${null}       | ${''}
    ${undefined}  | ${''}
    ${[]}         | ${''}
    ${['a', 'b']} | ${'a, b'}
  `('should be $expected if argument is $arr', ({ arr, expected }) => {
    expect(__get__('join')(arr)).toBe(expected);
  });
});

describe('split()', () => {
  it.each`
    text          | expected
    ${null}       | ${null}
    ${undefined}  | ${null}
    ${''}         | ${null}
    ${','}        | ${null}
    ${'a'}        | ${['a']}
    ${'a,'}       | ${['a']}
    ${'a, b'}     | ${['a', 'b']}
    ${'a,\nb'}    | ${['a', 'b']}
    ${'a, b\n'}   | ${['a', 'b']}
    ${'\na, b'}   | ${['a', 'b']}
    ${'a, b,,,,'} | ${['a', 'b']}
  `('should be $expected if argument is $text', ({ text, expected }) => {
    expect(__get__('split')(text)).toEqual(expected);
  });
});
