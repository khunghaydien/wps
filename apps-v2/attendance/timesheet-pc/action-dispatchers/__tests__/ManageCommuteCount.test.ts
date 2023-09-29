import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import RemoteError from '../../../../commons/errors/RemoteError';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import { AppDispatch } from '../AppThunk';
import { update } from '../ManageCommuteCount';

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  ApiMock.reset();
  ApiMock.invoke.mockReset();
});
describe('update()', () => {
  test('should be update.', async () => {
    // Arrange
    ApiMock.invoke.mockResolvedValueOnce();
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;

    // Act
    await dispatch(
      update({
        commuteCount: {
          forwardCount: 0,
          backwardCount: 1,
        },
        targetDate: '2020-01-01',
        employeeId: 'employeeId',
      })
    );

    // Assert
    // API should be called.
    expect(ApiMock.invoke).toBeCalledWith({
      path: '/att/daily-commute-count/save',
      param: {
        empId: 'employeeId',
        targetDate: '2020-01-01',
        commuteForwardCount: 0,
        commuteBackwardCount: 1,
      },
    });
    // Actions should be called as correct order.
    expect(store.getActions()).toMatchSnapshot();
  });

  test('should be update if employeeId is null.', async () => {
    // Arrange
    ApiMock.invoke.mockResolvedValueOnce();
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;

    // Act
    await dispatch(
      update({
        commuteCount: {
          forwardCount: 0,
          backwardCount: 1,
        },
        targetDate: '2020-01-01',
      })
    );

    // Assert
    // API should be called.
    expect(ApiMock.invoke).toBeCalledWith({
      path: '/att/daily-commute-count/save',
      param: {
        empId: undefined,
        targetDate: '2020-01-01',
        commuteForwardCount: 0,
        commuteBackwardCount: 1,
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
    await dispatch(
      update({
        commuteCount: {
          forwardCount: 0,
          backwardCount: 1,
        },
        targetDate: '2020-01-01',
        employeeId: 'employeeId',
      })
    );

    // Assert
    // API should be called.
    expect(ApiMock.invoke).toBeCalledWith({
      path: '/att/daily-commute-count/save',
      param: {
        empId: 'employeeId',
        targetDate: '2020-01-01',
        commuteForwardCount: 0,
        commuteBackwardCount: 1,
      },
    });
    // Actions should be called as correct order.
    expect(store.getActions()).toMatchSnapshot();
  });
});
