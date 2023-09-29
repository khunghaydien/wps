import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import RemoteError from '../../../../commons/errors/RemoteError';

import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import { AppDispatch } from '../AppThunk';
import { load } from '../AvailableDailyRequest';

const mockStore = configureMockStore([thunk]);

describe('load()', () => {
  test('should load Available Daily Request.', async () => {
    // Arrange
    ApiMock.invoke.mockResolvedValue({
      availableRequestTypeCodesMap: {
        a: [CODE.Absence],
        b: [CODE.Direct],
        c: [CODE.EarlyLeave, CODE.LateArrival],
      },
    });
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;

    // Act
    await dispatch(load('2017-07-01', 'employeeId'));

    // Assert
    expect(ApiMock.invoke).toBeCalledWith({
      path: '/att/daily-request/available/list',
      param: {
        targetDate: '2017-07-01',
        empId: 'employeeId',
      },
    });
    expect(store.getActions()).toMatchSnapshot();
  });

  test('should load if employeeId is null.', async () => {
    // Arrange
    ApiMock.invoke.mockResolvedValueOnce({
      availableRequestTypeCodesMap: {
        a: [CODE.Absence],
        b: [CODE.Direct],
        c: [CODE.EarlyLeave, CODE.LateArrival],
      },
    });
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;

    // Act
    await dispatch(load('2017-07-01'));

    // Assert
    // API should be called.
    expect(ApiMock.invoke).toBeCalledWith({
      path: '/att/daily-request/available/list',
      param: {
        targetDate: '2017-07-01',
        empId: null,
      },
    });
    // Actions should be called as correct order.
    expect(store.getActions()).toMatchSnapshot();
  });

  test('should be called catchApiError() if API returns a error.', async () => {
    // Arrange
    ApiMock.invoke.mockRejectedValueOnce(
      new RemoteError({
        isSuccess: false,
        error: {
          errorCode: 'test',
          message: 'error test',
          stackTrace: 'stackTrace',
          groupCode: 1,
        },
      })
    );
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;

    // Act
    await dispatch(load('2017-07-01', 'employeeId'));

    // Assert
    expect(ApiMock.invoke).toBeCalledWith({
      path: '/att/daily-request/available/list',
      param: {
        targetDate: '2017-07-01',
        empId: 'employeeId',
      },
    });
    expect(store.getActions()).toMatchSnapshot();
  });
});
