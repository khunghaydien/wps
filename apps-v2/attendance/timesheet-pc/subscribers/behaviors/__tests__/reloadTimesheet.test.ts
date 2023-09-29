import configureMockStore from 'redux-mock-store';

import behavior from '../reloadTimesheet';
import UseCases from '@attendance/timesheet-pc/UseCases';

jest.mock('@attendance/timesheet-pc/UseCases');

const createStore = configureMockStore();

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
  expect(UseCases().fetchTimesheet).toBeCalledTimes(1);
  expect(UseCases().fetchTimesheet).toBeCalledWith({
    targetDate: '2022-02-22',
    employeeId: null,
  });
  expect(store.getActions()).toMatchSnapshot();
});
