import configureMockStore from 'redux-mock-store';

import createControllers from '../controllers';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';
import UseCases from '@attendance/timesheet-pc-importer/UseCases';
import TimesheetFactory from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel/TimesheetFactory';

jest.mock('@attendance/timesheet-pc-importer/modules/selectors', () => ({
  __esModules: true,
  ownerEmployeeId: () => 'ownerEmployeeId',
}));
jest.mock('@attendance/timesheet-pc-importer/UseCases');
jest.mock(
  '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel/TimesheetFactory'
);

const mockStore = configureMockStore();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('updateStartDate', () => {
  it('should call', async () => {
    // Arrange
    const store = mockStore({
      timesheet: {
        endDate: '2023-01-31',
      },
    });
    const controllers = createControllers(store as AppStore);

    // Act
    await controllers.updateStartDate('2023-01-01');

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it.each(['2023-01-01', '2023-03-01', '', null])(
    'should calls with alert',
    async (startDate) => {
      // Arrange
      const store = mockStore({
        timesheet: {
          endDate: '2023-02-28',
        },
      });
      const controllers = createControllers(store as AppStore);

      // Act
      await controllers.updateStartDate(startDate);

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    }
  );
});

describe('updateEndDate', () => {
  it('should call', async () => {
    // Arrange
    const store = mockStore({
      timesheet: {
        startDate: '2023-01-01',
      },
    });
    const controllers = createControllers(store as AppStore);

    // Act
    await controllers.updateEndDate('2023-01-31');

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it.each(['2023-02-28', '2022-12-31', '', null])(
    'should calls with alert',
    async (endDate) => {
      // Arrange
      const store = mockStore({
        timesheet: {
          startDate: '2023-01-01',
        },
      });
      const controllers = createControllers(store as AppStore);

      // Act
      await controllers.updateEndDate(endDate);

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    }
  );
});

describe('checkTimesheet', () => {
  it('should call', async () => {
    // Arrange
    const store = mockStore({
      timesheet: {
        startDate: 'storeStartDate',
        endDate: 'storeEndDate',
        records: new Map([
          ['recordDate1', { checked: true, recordDate: 'recordDate1' }],
          ['recordDate2', { checked: true, recordDate: 'recordDate2' }],
        ]),
      },
    });
    const controllers = createControllers(store as AppStore);

    // Act
    await controllers.checkTimesheet();

    // Assert
    expect(UseCases().checkTimesheet).toHaveBeenCalledTimes(1);
    expect(UseCases().checkTimesheet).toHaveBeenCalledWith({
      employeeId: 'ownerEmployeeId',
      startDate: 'recordDate1',
      endDate: 'recordDate2',
    });
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('saveTimesheet', () => {
  it('should call', async () => {
    // Arrange
    (TimesheetFactory.create as jest.Mock).mockReturnValue(
      'convertedTimesheet'
    );
    const store = mockStore({
      timesheet: {
        startDate: 'startDate',
        endDate: 'endDate',
        records: new Map([
          ['recordDate1', { recordDate: 'recordDate1' }],
          ['recordDate2', { recordDate: 'recordDate2' }],
        ]),
      },
    });
    const controllers = createControllers(store as AppStore);

    // Act
    await controllers.saveTimesheet();

    // Assert
    expect(TimesheetFactory.create).toHaveBeenCalledTimes(1);
    expect(TimesheetFactory.create).toHaveBeenCalledWith({
      employeeId: 'ownerEmployeeId',
      records: [
        {
          recordDate: 'recordDate1',
        },
        {
          recordDate: 'recordDate2',
        },
      ],
    });
    expect(UseCases().saveTimesheet).toHaveBeenCalledTimes(1);
    expect(UseCases().saveTimesheet).toHaveBeenCalledWith('convertedTimesheet');
    expect(store.getActions()).toMatchSnapshot();
  });
});
