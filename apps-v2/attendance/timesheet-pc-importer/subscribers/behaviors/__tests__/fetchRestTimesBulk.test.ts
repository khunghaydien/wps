import configureMockStore from 'redux-mock-store';

import behavior from '../fetchRestTimesBulk';
import { IOutputData } from '@attendance/domain/useCases/importer/timesheet/IFetchContractedWorkTimesUseCase';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';
import UseCases from '@attendance/timesheet-pc-importer/UseCases';

jest.mock('@attendance/timesheet-pc-importer/UseCases');

const createStore = configureMockStore();

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do', async () => {
  // Arrange
  const store = createStore({
    common: {
      userSetting: {
        employeeId: 'employeeId',
      },
      proxyEmployeeInfo: null,
    },
  });

  // Act
  await behavior(store as AppStore)([
    {
      startDate: 'startDate1',
      endDate: 'endDate1',
      workingTypes: [
        {
          startDate: 'startDateW1-1',
          endDate: 'endDateW1-1',
        },
        {
          startDate: 'startDateW1-2',
          endDate: 'endDateW1-2',
        },
      ],
    },
    {
      startDate: 'startDate2',
      endDate: 'endDate2',
      workingTypes: [
        {
          startDate: 'startDateW2-1',
          endDate: 'endDateW2-1',
        },
      ],
    },
    {
      startDate: 'startDate3',
      endDate: 'endDate3',
    },
  ] as unknown as IOutputData);

  // Assert
  expect(UseCases().fetchRestTimeReasonsForBulk).toHaveBeenCalledTimes(3);
  expect(UseCases().fetchRestTimeReasonsForBulk).toHaveBeenNthCalledWith(1, {
    employeeId: 'employeeId',
    targetDate: 'startDateW1-1',
  });
  expect(UseCases().fetchRestTimeReasonsForBulk).toHaveBeenNthCalledWith(2, {
    employeeId: 'employeeId',
    targetDate: 'startDateW1-2',
  });
  expect(UseCases().fetchRestTimeReasonsForBulk).toHaveBeenNthCalledWith(3, {
    employeeId: 'employeeId',
    targetDate: 'startDateW2-1',
  });
});
