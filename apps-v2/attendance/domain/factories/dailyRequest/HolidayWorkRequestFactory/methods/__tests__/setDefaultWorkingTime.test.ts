import method from '../setDefaultWorkingTime';

it.each`
  request                         | workingType                           | expected
  ${{}}                           | ${{}}                                 | ${{ startTime: null, endTime: null }}
  ${{}}                           | ${{ startTime: null, endTime: null }} | ${{ startTime: null, endTime: null }}
  ${{}}                           | ${{ startTime: 0, endTime: 0 }}       | ${{ startTime: 0, endTime: 0 }}
  ${{ startTime: 1, endTime: 1 }} | ${{}}                                 | ${{ startTime: null, endTime: null }}
  ${{ startTime: 1, endTime: 1 }} | ${{ startTime: null, endTime: null }} | ${{ startTime: null, endTime: null }}
  ${{ startTime: 1, endTime: 1 }} | ${{ startTime: 0, endTime: 0 }}       | ${{ startTime: 0, endTime: 0 }}
`(
  'should set default startTime and endTime',
  ({ request, workingType, expected }) => {
    const result = method(workingType)(request);
    expect(result.startTime).toEqual(expected.startTime);
    expect(result.endTime).toEqual(expected.endTime);
  }
);
