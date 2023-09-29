import getClosest from '../getClosest';

// Arrange
const list = [
  {
    startDate: '2022-01-01',
    endDate: '2022-01-10',
  },
  {
    startDate: '2022-01-11',
    endDate: '2022-01-20',
  },
  {
    startDate: '2022-01-21',
    endDate: '2022-01-31',
  },
];
it.each`
  targetDate      | expected
  ${'2021-12-31'} | ${list[0]}
  ${'2022-01-01'} | ${list[0]}
  ${'2022-01-09'} | ${list[0]}
  ${'2022-01-10'} | ${list[0]}
  ${'2022-01-11'} | ${list[1]}
  ${'2022-01-12'} | ${list[1]}
  ${'2022-01-20'} | ${list[1]}
  ${'2022-01-21'} | ${list[2]}
  ${'2022-01-30'} | ${list[2]}
  ${'2022-01-31'} | ${list[2]}
  ${'2022-01-31'} | ${list[2]}
  ${'2022-02-01'} | ${list[2]}
`('return $expected if target is targetDate.', ({ targetDate, expected }) => {
  expect(getClosest(targetDate, list)).toEqual(expected);
});
