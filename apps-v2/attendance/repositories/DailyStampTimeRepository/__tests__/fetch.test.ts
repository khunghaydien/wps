import * as DomainFixDailyRequest from '@attendance/domain/models/FixDailyRequest';

import Api from '../../../../../__tests__/mocks/ApiMock';
import fetch, { NOT_HAVE_COMMUTE_COUNT } from '../fetch';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should convert', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce({
    isEnableStartStamp: 'isEnableStartStamp',
    isEnableEndStamp: 'isEnableEndStamp',
    isEnableRestartStamp: 'isEnableRestartStamp',
    stampInDate: 'stampInDate',
    stampOutDate: 'stampOutDate',
    stampReInDate: 'stampReInDate',
    defaultAction: 'defaultAction',
    commuteForwardCount: 'commuteForwardCount',
    commuteBackwardCount: 'commuteBackwardCount',
    isPossibleFixDailyRequest: 'isPossibleFixDailyRequest',
    record: {
      recordId: 'recordId',
      fixDailyRequest: {
        requestId: 'fixDailyRequestId',
        status: 'fixDailyRequestStatus',
      },
    },
  });

  // Act
  const response = await fetch('employeeId');

  // Assert
  expect(response).toEqual({
    isEnableStartStamp: 'isEnableStartStamp',
    isEnableEndStamp: 'isEnableEndStamp',
    isEnableRestartStamp: 'isEnableRestartStamp',
    stampInDate: 'stampInDate',
    stampOutDate: 'stampOutDate',
    stampReInDate: 'stampReInDate',
    defaultAction: 'defaultAction',
    commuteCount: null,
    isPossibleFixDailyRequest: 'isPossibleFixDailyRequest',
    record: {
      id: 'recordId',
      fixDailyRequest: {
        id: 'fixDailyRequestId',
        status: 'fixDailyRequestStatus',
        approver01Name: '',
        performableActionForFix: DomainFixDailyRequest.ACTIONS_FOR_FIX.None,
      },
    },
  });
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-time/get',
    param: {
      empId: 'employeeId',
    },
  });
});

it.each`
  commuteForwardCount       | commuteBackwardCount      | expected
  ${NOT_HAVE_COMMUTE_COUNT} | ${NOT_HAVE_COMMUTE_COUNT} | ${null}
  ${null}                   | ${null}                   | ${{ forwardCount: null, backwardCount: null }}
  ${0}                      | ${0}                      | ${{ forwardCount: 0, backwardCount: 0 }}
  ${0}                      | ${1}                      | ${{ forwardCount: 0, backwardCount: 1 }}
  ${1}                      | ${0}                      | ${{ forwardCount: 1, backwardCount: 0 }}
  ${1}                      | ${1}                      | ${{ forwardCount: 1, backwardCount: 1 }}
`('should convert with commute count', async ({ expected, ...values }) => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce({
    isEnableStartStamp: 'isEnableStartStamp',
    isEnableEndStamp: 'isEnableEndStamp',
    isEnableRestartStamp: 'isEnableRestartStamp',
    stampInDate: 'stampInDate',
    stampOutDate: 'stampOutDate',
    stampReInDate: 'stampReInDate',
    defaultAction: 'defaultAction',
    isPossibleFixDailyRequest: 'isPossibleFixDailyRequest',
    record: null,
    ...values,
  });

  // Act
  const response = await fetch('employeeId');

  // Assert
  expect(response.commuteCount).toEqual(expected);
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-time/get',
    param: {
      empId: 'employeeId',
    },
  });
});

it('should convert if record is null', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce({
    isEnableStartStamp: 'isEnableStartStamp',
    isEnableEndStamp: 'isEnableEndStamp',
    isEnableRestartStamp: 'isEnableRestartStamp',
    stampInDate: 'stampInDate',
    stampOutDate: 'stampOutDate',
    stampReInDate: 'stampReInDate',
    defaultAction: 'defaultAction',
    commuteForwardCount: 'commuteForwardCount',
    commuteBackwardCount: 'commuteBackwardCount',
    isPossibleFixDailyRequest: 'isPossibleFixDailyRequest',
    record: null,
  });

  // Act
  const response = await fetch('employeeId');

  // Assert
  expect(response).toEqual({
    isEnableStartStamp: 'isEnableStartStamp',
    isEnableEndStamp: 'isEnableEndStamp',
    isEnableRestartStamp: 'isEnableRestartStamp',
    stampInDate: 'stampInDate',
    stampOutDate: 'stampOutDate',
    stampReInDate: 'stampReInDate',
    defaultAction: 'defaultAction',
    commuteCount: null,
    isPossibleFixDailyRequest: 'isPossibleFixDailyRequest',
    record: {
      id: '',
      fixDailyRequest: {
        id: '',
        status: DomainFixDailyRequest.STATUS.NOT_REQUESTED,
        approver01Name: '',
        performableActionForFix: DomainFixDailyRequest.ACTIONS_FOR_FIX.Submit,
      },
    },
  });
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-time/get',
    param: {
      empId: 'employeeId',
    },
  });
});

it('should convert with FixDailyRequest', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce({
    isEnableStartStamp: 'isEnableStartStamp',
    isEnableEndStamp: 'isEnableEndStamp',
    isEnableRestartStamp: 'isEnableRestartStamp',
    stampInDate: 'stampInDate',
    stampOutDate: 'stampOutDate',
    stampReInDate: 'stampReInDate',
    defaultAction: 'defaultAction',
    commuteForwardCount: 'commuteForwardCount',
    commuteBackwardCount: 'commuteBackwardCount',
    isPossibleFixDailyRequest: 'isPossibleFixDailyRequest',
    record: {
      recordId: 'recordId',
      fixDailyRequest: {
        requestId: 'fixDailyRequestId',
        status: DomainFixDailyRequest.STATUS.PENDING,
      },
    },
  });

  // Act
  const response = await fetch('employeeId');

  // Assert
  expect(response).toEqual({
    isEnableStartStamp: 'isEnableStartStamp',
    isEnableEndStamp: 'isEnableEndStamp',
    isEnableRestartStamp: 'isEnableRestartStamp',
    stampInDate: 'stampInDate',
    stampOutDate: 'stampOutDate',
    stampReInDate: 'stampReInDate',
    defaultAction: 'defaultAction',
    commuteCount: null,
    isPossibleFixDailyRequest: 'isPossibleFixDailyRequest',
    record: {
      id: 'recordId',
      fixDailyRequest: {
        id: 'fixDailyRequestId',
        status: DomainFixDailyRequest.STATUS.PENDING,
        approver01Name: '',
        performableActionForFix:
          DomainFixDailyRequest.ACTIONS_FOR_FIX.CancelRequest,
      },
    },
  });
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-time/get',
    param: {
      empId: 'employeeId',
    },
  });
});
