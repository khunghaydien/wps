import method from '../setEnabledPatternApply';

it.each`
  request | workingType                              | expected
  ${{}}   | ${{}}                                    | ${false}
  ${{}}   | ${{ useHolidayWorkPatternApply: false }} | ${false}
  ${{}}   | ${{ useHolidayWorkPatternApply: true }}  | ${true}
`(
  'should set default startTime and endTime',
  ({ request, workingType, expected }) => {
    const result = method(workingType)(request);
    expect(result.enabledPatternApply).toEqual(expected);
  }
);
