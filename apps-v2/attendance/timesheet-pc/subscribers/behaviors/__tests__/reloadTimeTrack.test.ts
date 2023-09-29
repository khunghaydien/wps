import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import clone from 'lodash/cloneDeep';

import { isAvailableTimeTrack } from '@apps/domain/models/access-control/Permission';

import { loadDailyTimeTrackRecords } from '@attendance/timesheet-pc/action-dispatchers/DailyTimeTrack';
import { loadTimeTrackAlerts } from '@attendance/timesheet-pc/action-dispatchers/TimeTrackAlert';

import behavior from '../reloadTimeTrack';
import * as AccessControlService from '@attendance/application/AccessControlService';

jest.mock('@apps/domain/models/access-control/Permission');
jest.mock('@attendance/timesheet-pc/action-dispatchers/DailyTimeTrack');
jest.mock('@attendance/timesheet-pc/action-dispatchers/TimeTrackAlert');
jest.mock('@attendance/application/AccessControlService');

const $isAvailableTimeTrack = isAvailableTimeTrack as jest.Mock;
const $loadDailyTimeTrackRecords = loadDailyTimeTrackRecords as jest.Mock;
const $loadTimeTrackAlerts = loadTimeTrackAlerts as jest.Mock;

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
  $isAvailableTimeTrack.mockReturnValueOnce(true);

  // Act
  await behavior(store)({ timesheet: 'timesheet' } as unknown as Input);

  // Assert
  expect($isAvailableTimeTrack).toBeCalledTimes(1);
  expect($isAvailableTimeTrack).toBeCalledWith(
    AccessControlService.getPermission(),
    defaultState.common.userSetting,
    false
  );
  expect($loadTimeTrackAlerts).toBeCalledTimes(1);
  expect($loadTimeTrackAlerts).toBeCalledWith('timesheet', undefined);
  expect($loadDailyTimeTrackRecords).toBeCalledTimes(1);
  expect($loadDailyTimeTrackRecords).toBeCalledWith('timesheet', undefined);
  expect(store.getActions()).toMatchSnapshot();
});

it.each`
  not      | inputEmployeeId | userSettingEmployeeId | expected
  ${'not'} | ${undefined}    | ${'employeeId'}       | ${false}
  ${'not'} | ${null}         | ${'employeeId'}       | ${false}
  ${'not'} | ${''}           | ${'employeeId'}       | ${false}
  ${'not'} | ${'employeeId'} | ${'employeeId'}       | ${false}
  ${'not'} | ${'a'}          | ${'b'}                | ${true}
`(
  'should $not be delegated [input.employeeId=$inputEmployeeId, userSetting.employeeId=$userSettingEmployeeId]',
  async ({ inputEmployeeId, userSettingEmployeeId, expected }) => {
    // Arrange
    const state = clone(defaultState);
    state.common.userSetting.employeeId = userSettingEmployeeId;
    const store = createStore(state);
    $isAvailableTimeTrack.mockReturnValueOnce(true);

    // Act
    await behavior(store)({
      employeeId: inputEmployeeId,
      timesheet: 'timesheet',
    } as unknown as Input);

    // Assert
    expect($isAvailableTimeTrack).toBeCalledTimes(1);
    expect($isAvailableTimeTrack).toBeCalledWith(
      AccessControlService.getPermission(),
      state.common.userSetting,
      expected
    );
  }
);

it('should not do when has not permission', async () => {
  // Arrange
  const store = createStore(defaultState);
  $isAvailableTimeTrack.mockReturnValueOnce(false);

  // Act
  await behavior(store)({ timesheet: 'timesheet' } as unknown as Input);

  // Assert
  expect($isAvailableTimeTrack).toBeCalledTimes(1);
  expect($loadTimeTrackAlerts).toBeCalledTimes(0);
  expect($loadDailyTimeTrackRecords).toBeCalledTimes(0);
  expect(store.getActions()).toMatchSnapshot();
});

it('should not do if timesheet is null', async () => {
  // Arrange
  const store = createStore(defaultState);

  // Act
  await behavior(store)({ timesheet: null } as unknown as Input);

  // Assert
  expect($isAvailableTimeTrack).toBeCalledTimes(0);
  expect($loadTimeTrackAlerts).toBeCalledTimes(0);
  expect($loadDailyTimeTrackRecords).toBeCalledTimes(0);
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
  expect($isAvailableTimeTrack).toBeCalledTimes(0);
  expect($loadTimeTrackAlerts).toBeCalledTimes(0);
  expect($loadDailyTimeTrackRecords).toBeCalledTimes(0);
  expect(store.getActions()).toMatchSnapshot();
});

it('should do catchApiError if error is not occurred', async () => {
  // Arrange
  const store = createStore(defaultState);
  $isAvailableTimeTrack.mockReturnValueOnce(true);
  $loadTimeTrackAlerts.mockReturnValueOnce(() => {
    const error = Error('ERROR: loadTimeTrackAlerts');
    error.stack = null;
    return Promise.reject(error);
  });
  $loadDailyTimeTrackRecords.mockReturnValue(() => {
    const error = Error('ERROR: loadDailyTimeTrackRecords');
    error.stack = null;
    return Promise.reject(error);
  });

  // Act
  await behavior(store)({ timesheet: 'timesheet' } as unknown as Input);

  // Assert
  expect(store.getActions()).toMatchSnapshot();
});

it('should not do catchApiError if error is occurred', async () => {
  // Arrange
  const state = clone(defaultState);
  state.common.app.error = 'error';
  const store = createStore(state);
  $isAvailableTimeTrack.mockReturnValueOnce(true);
  $loadTimeTrackAlerts.mockReturnValueOnce(() => {
    const error = Error('ERROR: loadTimeTrackAlerts');
    error.stack = null;
    return Promise.reject(error);
  });
  $loadDailyTimeTrackRecords.mockReturnValue(() => {
    const error = Error('ERROR: loadDailyTimeTrackRecords');
    error.stack = null;
    return Promise.reject(error);
  });

  // Act
  await behavior(store)({ timesheet: 'timesheet' } as unknown as Input);

  // Assert
  expect(store.getActions()).toMatchSnapshot();
});
