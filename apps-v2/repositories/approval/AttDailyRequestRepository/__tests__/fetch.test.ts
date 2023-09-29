import snapshotDiff from 'snapshot-diff';

import MockApi from '../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetch';
import {
  absence,
  direct,
  earlyLeave,
  earlyStartWork,
  holidayWork,
  lateArrival,
  leave,
  none,
  overtimeWork,
  pattern,
} from './mocks/fetch.mock';

beforeEach(() => {
  (MockApi.invoke as jest.Mock).mockClear();
});

test.each([
  ['Absence', absence],
  ['Direct', direct],
  ['EarlyLeave', earlyLeave],
  ['EarlyStartWork', earlyStartWork],
  ['HolidayWork', holidayWork],
  ['LateArrival', lateArrival],
  ['Leave', leave],
  ['OvertimeWork', overtimeWork],
  ['Pattern', pattern],
  ['None', none],
])(
  'convert return value (%s)',
  // @ts-ignore
  async (_, value: AttDailyDetailFromRequestDetail) => {
    // Arrange
    (MockApi.invoke as jest.Mock).mockResolvedValueOnce(value);

    // Act
    const result = await fetch('id');

    // Assert
    expect(snapshotDiff(value, result)).toMatchSnapshot();
  }
);

it('should call by Id', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(none);

  // Act
  await fetch('xxxx');

  // Assert
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/request/daily/get',
    param: { requestId: 'xxxx' },
  });
});
