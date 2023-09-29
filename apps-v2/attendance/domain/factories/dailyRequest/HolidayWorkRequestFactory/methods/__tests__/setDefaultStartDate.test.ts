import method from '../setDefaultStartDate';

it.each`
  request                        | targetDate      | expected
  ${{}}                          | ${null}         | ${null}
  ${{}}                          | ${''}           | ${null}
  ${{}}                          | ${'2023-01-01'} | ${'2023-01-01'}
  ${{ startDate: '2023-02-02' }} | ${null}         | ${null}
  ${{ startDate: '2023-02-02' }} | ${''}           | ${null}
  ${{ startDate: '2023-02-02' }} | ${'2023-01-01'} | ${'2023-01-01'}
`('should set default targetDate', ({ request, targetDate, expected }) => {
  const result = method(targetDate)(request);
  expect(result.startDate).toEqual(expected);
});
