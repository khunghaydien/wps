import * as MasterEmployeeHistory from '../MasterEmployeeHistory';

const { defaultValue } = MasterEmployeeHistory;

describe('getClosest', () => {
  const { getClosest } = MasterEmployeeHistory;
  const historyList = [
    {
      ...defaultValue,
      validDateFrom: '2019-10-10',
    },
    {
      ...defaultValue,
      validDateFrom: '2019-10-11',
    },
    {
      ...defaultValue,
      validDateFrom: '2019-10-12',
    },
  ];

  it('Length is 0', () => {
    expect(getClosest('2019-10-11', [])).toBe(null);
  });

  it('Same', () => {
    expect(getClosest('2019-10-11', historyList)).toBe(historyList[1]);
  });

  it('Past', () => {
    expect(getClosest('2019-10-09', historyList)).toBe(historyList[0]);
  });

  it('Future', () => {
    expect(getClosest('2019-10-13', historyList)).toBe(historyList[2]);
  });
});
