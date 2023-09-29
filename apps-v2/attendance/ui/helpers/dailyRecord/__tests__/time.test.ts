import * as helper from '../time';

describe('toHHmm', () => {
  it.each`
    value   | expected
    ${0}    | ${'00:00'}
    ${60}   | ${'01:00'}
    ${null} | ${''}
  `('should return $expected when [value=$value]', ({ value, expected }) => {
    expect(helper.toHHmm(value)).toBe(expected);
  });
});

describe('toNumberOrNull', () => {
  it.each`
    value      | expected
    ${'00:00'} | ${0}
    ${'01:00'} | ${60}
    ${''}      | ${null}
    ${null}    | ${null}
  `('should return $expected when [value=$value]', ({ value, expected }) => {
    expect(helper.toNumberOrNull(value)).toBe(expected);
  });
});
