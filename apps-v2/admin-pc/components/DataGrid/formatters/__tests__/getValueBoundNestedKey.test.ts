// @ts-nocheck

import getValueBoundNestedKey from '../getValueBoundNestedKey';

describe('getValueBoundNestedKey(key)({ value })', () => {
  test('Get Value in Non-Nested Object', () => {
    expect(getValueBoundNestedKey('a')({ value: { a: 1 } })).toBe(1);
  });

  test('Get Value in Nested Object by Dot-chained Key string', () => {
    expect(
      getValueBoundNestedKey('a.b.c')({ value: { a: { b: { c: 1 } } } })
    ).toBe(1);
  });

  test("If Dot-chained Key unmatched (Too Long), Return ''", () => {
    expect(getValueBoundNestedKey('a.b.c')({ value: { a: { b: 1 } } })).toBe(
      ''
    );
  });

  test('If the value is 0, returns 0', () => {
    expect(getValueBoundNestedKey('a')({ value: { a: 0 } })).toBe(0);
  });
});
