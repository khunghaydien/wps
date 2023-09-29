import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import TimesheetRepository from '@attendance/repositories/TimesheetRepository';

import { initDailyStampTime } from '@attendance/timesheet-pc/action-dispatchers/StampWidget';

import UseCases from '../../UseCases';
import { AppDispatch } from '../AppThunk';
import { loadDailyTimeTrackRecords } from '../DailyTimeTrack';
import * as TimesheetActions from '../Timesheet';
import { loadTimeTrackAlerts } from '../TimeTrackAlert';

jest.mock('../TimeTrackAlert');
jest.mock('../DailyTimeTrack');
jest.mock('../StampWidget');
jest.mock('@attendance/repositories/DailyObjectivelyEventLogRepository');
jest.mock('@attendance/repositories/TimesheetRepository');
jest.mock('../../UseCases');

const mockStore = configureMockStore([thunk]);

const reloadTimesheet = () => ({
  type: 'FETCH_TIMESHEET',
});

beforeEach(() => {
  jest.clearAllMocks();
  (UseCases().fetchTimesheet as unknown as jest.Mock).mockReset();
  (initDailyStampTime as jest.Mock).mockImplementation(
    (...args) =>
      (dispatch: AppDispatch) => {
        dispatch({ type: 'INIT_DAILY_STAMP_TIME', payload: args });
        return Promise.resolve();
      }
  );
  (loadTimeTrackAlerts as jest.Mock).mockImplementation(
    (...args) =>
      (dispatch: AppDispatch) => {
        dispatch({ type: 'LOAD_TIME_TRACK_ALERTS', payload: args });
        return Promise.resolve();
      }
  );
  (loadDailyTimeTrackRecords as jest.Mock).mockImplementation(
    (...args) =>
      (dispatch: AppDispatch) => {
        dispatch({ type: 'LOAD_DAILY_TIME_TRACK_RECORDS', payload: args });
        return Promise.resolve();
      }
  );
});

describe('fetchTimesheetAndAvailableDailyRequest()', () => {
  it('should fetch timesheet and availableRequestTypeCodesMap', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;

    // Act
    await dispatch(
      TimesheetActions.fetchTimesheetAndAvailableDailyRequest(
        '2017-06-01',
        '2017-06-30',
        'employeeId'
      )
    );

    // Assert
    expect(TimesheetRepository.fetchRaw).toBeCalledTimes(1);
    expect(TimesheetRepository.fetchRaw).toBeCalledWith(
      '2017-06-01',
      'employeeId'
    );
    expect(TimesheetRepository.fetchAvailableDailyRequest).toBeCalledTimes(1);
    expect(TimesheetRepository.fetchAvailableDailyRequest).toBeCalledWith(
      '2017-06-01',
      'employeeId'
    );
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('onPeriodSelected()', () => {
  it('should do.', async () => {
    // Arrange
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () =>
        Promise.resolve({
          timesheet: {
            workingTypeList: [
              {
                useAllowanceManagement: false,
              },
            ],
          },
        })
    );

    // Act
    await TimesheetActions.onPeriodSelected('2020-01-01', 'employeeId');

    // Assert
    expect(UseCases().fetchTimesheet).toBeCalledTimes(1);
    expect(UseCases().fetchTimesheet).toBeCalledWith({
      targetDate: '2020-01-01',
      employeeId: 'employeeId',
    });
  });
  it('should return if isMigratedSummary is false.', async () => {
    // Arrange
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () =>
        Promise.resolve({
          timesheet: {
            isMigratedSummary: true,
            startDate: '2020-01-01',
            endDate: '2020-01-31',
            workingTypeList: [
              {
                useAllowanceManagement: false,
              },
            ],
          },
        })
    );

    // Act
    await TimesheetActions.onPeriodSelected('2020-01-01', 'employeeId');

    // Assert
    expect(UseCases().fetchTimesheet).toBeCalledTimes(1);
    expect(UseCases().fetchTimesheet).toBeCalledWith({
      targetDate: '2020-01-01',
      employeeId: 'employeeId',
    });
  });
});

describe('onExitProxyMode()', () => {
  it('should do.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () => {
        dispatch(reloadTimesheet());
        return Promise.resolve({
          timesheet: {
            workingTypeList: [
              {
                useAllowanceManagement: false,
              },
            ],
          },
        });
      }
    );

    // Act
    await dispatch(TimesheetActions.onExitProxyMode('2020-01-01'));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(UseCases().fetchTimesheet).toBeCalledTimes(1);
    expect(UseCases().fetchTimesheet).toBeCalledWith({
      targetDate: '2020-01-01',
    });
  });
  it('should return if isMigratedSummary is false.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () => {
        dispatch(reloadTimesheet());
        return Promise.resolve({
          timesheet: {
            isMigratedSummary: true,
            startDate: '2020-01-01',
            endDate: '2020-01-31',
            workingTypeList: [
              {
                useAllowanceManagement: false,
              },
            ],
          },
        });
      }
    );

    // Act
    await dispatch(TimesheetActions.onExitProxyMode('2020-01-01'));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(UseCases().fetchTimesheet).toBeCalledTimes(1);
    expect(UseCases().fetchTimesheet).toBeCalledWith({
      targetDate: '2020-01-01',
    });
  });
});
