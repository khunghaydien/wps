import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { loadDailyAllowanceRecords } from '@attendance/timesheet-pc/action-dispatchers/DailyAllowance';

import behavior from '../reloadDailyAllowanceRecords';

jest.mock('@attendance/timesheet-pc/action-dispatchers/DailyAllowance', () => ({
  loadDailyAllowanceRecords: jest.fn((...args) => (dispatch) => {
    dispatch({ type: 'LOAD_DAILY_ALLOWANCE_RECORDS', payload: args });
    return Promise.resolve();
  }),
}));

const $loadDailyAllowanceRecords = loadDailyAllowanceRecords as jest.Mock;

const createStore = configureMockStore([thunk]);

const defaultState = {
  common: {
    app: {
      error: null,
    },
    userSetting: {
      employeeId: 'employeeId',
    },
  },
};

type Input = Parameters<ReturnType<typeof behavior>>[0];

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do.', async () => {
  // Arrange
  const store = createStore(defaultState);

  // Act
  await behavior(store)({
    employeeId: 'employeeId',
    timesheet: {
      workingTypeList: [
        {
          useAllowanceManagement: true,
        },
      ],
    },
  } as unknown as Input);

  // Assert
  expect($loadDailyAllowanceRecords).toBeCalledTimes(1);
  expect($loadDailyAllowanceRecords).toBeCalledWith(
    {
      workingTypeList: [
        {
          useAllowanceManagement: true,
        },
      ],
    },
    'employeeId'
  );
  expect(store.getActions()).toMatchSnapshot();
});

it.each([null, undefined])(
  'should do if employeeId is %s.',
  async (employeeId) => {
    // Arrange
    const store = createStore(defaultState);

    // Act
    await behavior(store)({
      employeeId,
      timesheet: {
        workingTypeList: [
          {
            useAllowanceManagement: true,
          },
        ],
      },
    } as unknown as Input);

    // Assert
    expect($loadDailyAllowanceRecords).toBeCalledTimes(1);
    expect($loadDailyAllowanceRecords).toBeCalledWith(
      {
        workingTypeList: [
          {
            useAllowanceManagement: true,
          },
        ],
      },
      undefined
    );
    expect(store.getActions()).toMatchSnapshot();
  }
);

it('should not do if timesheet is null', async () => {
  // Arrange
  const store = createStore(defaultState);

  // Act
  await behavior(store)({ timesheet: null } as unknown as Input);

  // Assert
  expect($loadDailyAllowanceRecords).toBeCalledTimes(0);
  expect(store.getActions()).toMatchSnapshot();
});

it('should not do if timesheet is migrated', async () => {
  // Arrange
  const store = createStore(defaultState);

  // Act
  await behavior(store)({
    timesheet: {
      isMigratedSummary: true,
    },
  } as unknown as Input);

  // Assert
  expect($loadDailyAllowanceRecords).toBeCalledTimes(0);
  expect(store.getActions()).toMatchSnapshot();
});
