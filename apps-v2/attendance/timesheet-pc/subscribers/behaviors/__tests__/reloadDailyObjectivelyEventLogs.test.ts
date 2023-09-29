import configureMockStore from 'redux-mock-store';

import behavior from '../reloadDailyObjectivelyEventLogs';
import { IOutputData } from '@attendance/domain/useCases/timesheet/IFetchUseCase';
import UseCases from '@attendance/timesheet-pc/UseCases';

jest.mock('@attendance/timesheet-pc/UseCases');

const createStore = configureMockStore();

const defaultState = {
  common: {
    app: {
      error: null,
    },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('should reload', async () => {
  // Arrange
  const store = createStore(defaultState);

  // Act
  await behavior(store)({
    employeeId: 'employeeId',
    timesheet: {
      startDate: '2022-02-01',
      endDate: '2022-02-28',
      workingTypeList: [
        {
          useObjectivelyEventLog: true,
        },
      ],
    },
  } as unknown as IOutputData);

  // Assert
  expect(UseCases().reloadDailyObjectivelyEventLogs).toBeCalledTimes(1);
  expect(UseCases().reloadDailyObjectivelyEventLogs).toBeCalledWith({
    employeeId: 'employeeId',
    startDate: '2022-02-01',
    endDate: '2022-02-28',
  });
  expect(store.getActions()).toMatchSnapshot();
});

it('should reset if timesheet is null', async () => {
  // Arrange
  const store = createStore(defaultState);

  // Act
  await behavior(store)({
    employeeId: 'employeeId',
    timesheet: null,
  } as unknown as IOutputData);

  // Assert
  expect(UseCases().reloadDailyObjectivelyEventLogs).toBeCalledTimes(0);
  expect(store.getActions()).toMatchSnapshot();
});

it('should reset if useObjectivelyEventLog is false', async () => {
  // Arrange
  const store = createStore(defaultState);

  // Act
  await behavior(store)({
    employeeId: 'employeeId',
    timesheet: {
      startDate: '2022-02-01',
      endDate: '2022-02-28',
      workingTypeList: [
        {
          useObjectivelyEventLog: false,
        },
      ],
    },
  } as unknown as IOutputData);

  // Assert
  expect(UseCases().reloadDailyObjectivelyEventLogs).toBeCalledTimes(0);
  expect(store.getActions()).toMatchSnapshot();
});
