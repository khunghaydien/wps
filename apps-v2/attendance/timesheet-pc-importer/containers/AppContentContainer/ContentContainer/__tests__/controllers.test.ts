import configureMockStore from 'redux-mock-store';

import createControllers from '../controllers';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';
import UseCases from '@attendance/timesheet-pc-importer/UseCases';
import * as DailyRecordViewModel from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';
import { defaultValues } from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel/__tests__/mocks/DailyRecordViewModel.mock';

jest.mock('@attendance/timesheet-pc-importer/UseCases');

jest.mock(
  '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel',
  () => ({
    __esModule: true,
    isRequiredLoadingLeaveRequestLeaves: jest.fn(),
    isRequiredLoadingRestTimeReasons: jest.fn(),
    isRequiredLoadingEarlyLeaveRequestReasons: jest.fn(),
    isRequiredLoadingLateArrivalRequestReasons: jest.fn(),
  })
);

const mockStore = configureMockStore();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('updateDailyRecord', () => {
  it('should update records', async () => {
    // Arrange
    const store = mockStore({
      common: {
        userSetting: {
          employeeId: 'employeeId',
        },
        proxyEmployeeInfo: null,
      },
    });
    const controllers = createControllers(store as AppStore);

    // Act
    await controllers.updateDailyRecords(['records'] as unknown as Parameters<
      typeof controllers['updateDailyRecords']
    >[0]);

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  describe('fetchLeaveList', () => {
    const records = new Map(
      defaultValues.map((record) => [record.recordDate, record]) as [
        string,
        DailyRecordViewModel.DailyRecordViewModel
      ][]
    );
    it('should call UseCases', async () => {
      // Arrange
      (
        DailyRecordViewModel.isRequiredLoadingLeaveRequestLeaves as jest.Mock
      ).mockReturnValue(true);
      const store = mockStore({
        common: {
          userSetting: {
            employeeId: 'employeeId',
          },
          proxyEmployeeInfo: null,
        },
      });
      const controllers = createControllers(store as AppStore);

      // Act
      await controllers.updateDailyRecords(new Map(records));

      // Assert
      expect(store.getActions().length).toBe(1);
      expect(
        DailyRecordViewModel.isRequiredLoadingLeaveRequestLeaves
      ).toHaveBeenCalledTimes(3);
      expect(UseCases().fetchLeaves).toHaveBeenCalledTimes(3);
      [...records.values()].forEach(
        (record: DailyRecordViewModel.DailyRecordViewModel, idx) => {
          expect(
            DailyRecordViewModel.isRequiredLoadingLeaveRequestLeaves
          ).toHaveBeenNthCalledWith(idx + 1, record);
          expect(UseCases().fetchLeaves).toHaveBeenNthCalledWith(idx + 1, {
            targetDate: record.recordDate,
            employeeId: 'employeeId',
          });
        }
      );
    });
    it('should not call UseCases', async () => {
      // Arrange
      (
        DailyRecordViewModel.isRequiredLoadingLeaveRequestLeaves as jest.Mock
      ).mockReturnValue(false);
      const store = mockStore({
        common: {
          userSetting: {
            employeeId: 'employeeId',
          },
          proxyEmployeeInfo: null,
        },
      });
      const controllers = createControllers(store as AppStore);

      // Act
      await controllers.updateDailyRecords(new Map(records));

      // Assert
      expect(store.getActions().length).toBe(1);
      expect(
        DailyRecordViewModel.isRequiredLoadingLeaveRequestLeaves
      ).toHaveBeenCalledTimes(3);
      expect(UseCases().fetchLeaves).toHaveBeenCalledTimes(0);
    });
  });

  describe('fetchEarlyLeaveReasons', () => {
    const records = new Map(
      defaultValues.map((record) => [record.recordDate, record]) as [
        string,
        DailyRecordViewModel.DailyRecordViewModel
      ][]
    );
    it('should call UseCases', async () => {
      // Arrange
      (
        DailyRecordViewModel.isRequiredLoadingEarlyLeaveRequestReasons as jest.Mock
      ).mockReturnValue(true);
      const store = mockStore({
        common: {
          userSetting: {
            employeeId: 'employeeId',
          },
          proxyEmployeeInfo: null,
        },
      });
      const controllers = createControllers(store as AppStore);

      // Act
      await controllers.updateDailyRecords(new Map(records));

      // Assert
      expect(store.getActions().length).toBe(1);
      expect(
        DailyRecordViewModel.isRequiredLoadingEarlyLeaveRequestReasons
      ).toHaveBeenCalledTimes(3);
      expect(UseCases().fetchEarlyLeaveReasons).toHaveBeenCalledTimes(3);
      [...records.values()].forEach(
        (record: DailyRecordViewModel.DailyRecordViewModel, idx) => {
          expect(
            DailyRecordViewModel.isRequiredLoadingEarlyLeaveRequestReasons
          ).toHaveBeenNthCalledWith(idx + 1, record);
          expect(UseCases().fetchEarlyLeaveReasons).toHaveBeenNthCalledWith(
            idx + 1,
            {
              targetDate: record.recordDate,
              employeeId: 'employeeId',
            }
          );
        }
      );
    });
    it('should not call UseCases', async () => {
      // Arrange
      (
        DailyRecordViewModel.isRequiredLoadingEarlyLeaveRequestReasons as jest.Mock
      ).mockReturnValue(false);
      const store = mockStore({
        common: {
          userSetting: {
            employeeId: 'employeeId',
          },
          proxyEmployeeInfo: null,
        },
      });
      const controllers = createControllers(store as AppStore);

      // Act
      await controllers.updateDailyRecords(new Map(records));

      // Assert
      expect(store.getActions().length).toBe(1);
      expect(
        DailyRecordViewModel.isRequiredLoadingEarlyLeaveRequestReasons
      ).toHaveBeenCalledTimes(3);
      expect(UseCases().fetchEarlyLeaveReasons).toHaveBeenCalledTimes(0);
    });
  });

  describe('fetchLateArrivalReasons', () => {
    const records = new Map(
      defaultValues.map((record) => [record.recordDate, record]) as [
        string,
        DailyRecordViewModel.DailyRecordViewModel
      ][]
    );
    it('should call UseCases', async () => {
      // Arrange
      (
        DailyRecordViewModel.isRequiredLoadingLateArrivalRequestReasons as jest.Mock
      ).mockReturnValue(true);
      const store = mockStore({
        common: {
          userSetting: {
            employeeId: 'employeeId',
          },
          proxyEmployeeInfo: null,
        },
      });
      const controllers = createControllers(store as AppStore);

      // Act
      await controllers.updateDailyRecords(new Map(records));

      // Assert
      expect(store.getActions().length).toBe(1);
      expect(
        DailyRecordViewModel.isRequiredLoadingLateArrivalRequestReasons
      ).toHaveBeenCalledTimes(3);
      expect(UseCases().fetchLateArrivalReasons).toHaveBeenCalledTimes(3);
      [...records.values()].forEach(
        (record: DailyRecordViewModel.DailyRecordViewModel, idx) => {
          expect(
            DailyRecordViewModel.isRequiredLoadingLateArrivalRequestReasons
          ).toHaveBeenNthCalledWith(idx + 1, record);
          expect(UseCases().fetchLateArrivalReasons).toHaveBeenNthCalledWith(
            idx + 1,
            {
              targetDate: record.recordDate,
              employeeId: 'employeeId',
            }
          );
        }
      );
    });
    it('should not call UseCases', async () => {
      // Arrange
      (
        DailyRecordViewModel.isRequiredLoadingLateArrivalRequestReasons as jest.Mock
      ).mockReturnValue(false);
      const store = mockStore({
        common: {
          userSetting: {
            employeeId: 'employeeId',
          },
          proxyEmployeeInfo: null,
        },
      });
      const controllers = createControllers(store as AppStore);

      // Act
      await controllers.updateDailyRecords(new Map(records));

      // Assert
      expect(store.getActions().length).toBe(1);
      expect(
        DailyRecordViewModel.isRequiredLoadingLateArrivalRequestReasons
      ).toHaveBeenCalledTimes(3);
      expect(UseCases().fetchLateArrivalReasons).toHaveBeenCalledTimes(0);
    });
  });

  describe('fetchRestTimeReasons', () => {
    const records = new Map(
      defaultValues.map((record) => [record.recordDate, record]) as [
        string,
        DailyRecordViewModel.DailyRecordViewModel
      ][]
    );

    it('should call UseCases', async () => {
      // Arrange
      (
        DailyRecordViewModel.isRequiredLoadingRestTimeReasons as jest.Mock
      ).mockReturnValue(true);
      const store = mockStore({
        common: {
          userSetting: {
            employeeId: 'employeeId',
          },
          proxyEmployeeInfo: null,
        },
      });
      const controllers = createControllers(store as AppStore);

      // Act
      await controllers.updateDailyRecords(new Map(records));

      // Assert
      expect(store.getActions().length).toBe(1);
      expect(UseCases().fetchRestTimeReasons).toHaveBeenCalledTimes(3);
      expect(
        DailyRecordViewModel.isRequiredLoadingRestTimeReasons
      ).toHaveBeenCalledTimes(3);
      [...records.values()].forEach((record, idx) => {
        expect(
          DailyRecordViewModel.isRequiredLoadingRestTimeReasons
        ).toHaveBeenNthCalledWith(idx + 1, record);
        expect(UseCases().fetchRestTimeReasons).toHaveBeenNthCalledWith(
          idx + 1,
          {
            targetDate: record.recordDate,
            employeeId: 'employeeId',
          }
        );
      });
    });
    it('should not call UseCases.', async () => {
      // Arrange
      (
        DailyRecordViewModel.isRequiredLoadingRestTimeReasons as jest.Mock
      ).mockReturnValue(false);
      const store = mockStore({
        common: {
          userSetting: {
            employeeId: 'employeeId',
          },
          proxyEmployeeInfo: null,
        },
      });
      const controllers = createControllers(store as AppStore);

      // Act
      await controllers.updateDailyRecords(new Map(records));

      // Assert
      expect(store.getActions().length).toBe(1);
      expect(
        DailyRecordViewModel.isRequiredLoadingLeaveRequestLeaves
      ).toHaveBeenCalledTimes(3);
      expect(UseCases().fetchRestTimeReasons).toHaveBeenCalledTimes(0);
    });
  });
});

describe('toggleCheckedAll', () => {
  it('should call actions', async () => {
    // Arrange
    const store = mockStore({
      common: {
        userSetting: {
          employeeId: 'employeeId',
        },
        proxyEmployeeInfo: null,
      },
      timesheet: {
        records: new Map(
          defaultValues.map((record) => [record.recordDate, record])
        ),
      },
    });
    const controllers = createControllers(store as AppStore);

    // Act
    await controllers.toggleCheckedAll();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
