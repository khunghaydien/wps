import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import clone from 'lodash/cloneDeep';

import { initDailyStampTime } from '@attendance/timesheet-pc/action-dispatchers/StampWidget';

import behavior from '../reloadStampTime';

jest.mock('@attendance/timesheet-pc/action-dispatchers/StampWidget', () => ({
  __esModule: true,
  initDailyStampTime: jest.fn(() => ({
    type: 'INIT_DAILY_STAMP_TIME',
  })),
}));

const $initDailyStampTime = initDailyStampTime as jest.Mock;

const createStore = configureMockStore([thunk]);

const defaultState = {
  client: {
    selectedPeriodStartDate: '2022-02-22',
  },
  common: {
    app: {
      error: null,
    },
    proxyEmployeeInfo: {
      id: 'employeeId',
      isProxyMode: false,
    },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do', async () => {
  // Arrange
  const store = createStore(defaultState);

  // Act
  await behavior(store)();

  // Assert
  expect(initDailyStampTime).toBeCalledTimes(1);
  expect(initDailyStampTime).toBeCalledWith();
  expect(store.getActions()).toMatchSnapshot();
});

it('should not do when delegated', async () => {
  // Arrange
  const state = clone(defaultState);
  state.common.proxyEmployeeInfo.isProxyMode = true;
  const store = createStore(state);

  // Act
  await behavior(store)();

  // Assert
  expect(initDailyStampTime).toBeCalledTimes(0);
  expect(store.getActions()).toMatchSnapshot();
});

it('should do catchApiError if error is not occurred', async () => {
  // Arrange
  const store = createStore(defaultState);
  $initDailyStampTime.mockReturnValueOnce(() => {
    const error = Error('ERROR: initDailyStampTime');
    error.stack = null;
    return Promise.reject(error);
  });

  // Act
  await behavior(store)();

  // Assert
  expect(store.getActions()).toMatchSnapshot();
});

it('should not do catchApiError if error is occurred', async () => {
  // Arrange
  const state = clone(defaultState);
  state.common.app.error = 'error';
  const store = createStore(state);
  $initDailyStampTime.mockReturnValueOnce(() => {
    const error = Error('ERROR: initDailyStampTime');
    error.stack = null;
    return Promise.reject(error);
  });

  // Act
  await behavior(store)();

  // Assert
  expect(store.getActions()).toMatchSnapshot();
});
