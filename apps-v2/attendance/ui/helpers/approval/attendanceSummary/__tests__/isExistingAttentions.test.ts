import isExistingAttentions from '../isExistingAttentions';

it.each`
  ineffectiveWorkingTime | insufficientRestTime | expected
  ${0}                   | ${0}                 | ${false}
  ${0}                   | ${1}                 | ${true}
  ${1}                   | ${0}                 | ${true}
  ${1}                   | ${1}                 | ${true}
`(
  'return $expected [ineffectiveWorkingTime=$ineffectiveWorkingTime, insufficientRestTime=$insufficientRestTime]',
  ({ expected, ...attention }) => {
    expect(
      isExistingAttentions({
        attention,
      })
    ).toBe(expected);
  }
);
