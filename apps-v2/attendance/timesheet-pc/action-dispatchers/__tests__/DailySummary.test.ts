import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import UseCases from '../../UseCases';
import { closeDailySummary } from '../DailySummary';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const state = {};

jest.mock('../../UseCases');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('closeDailySummary()', () => {
  ApiMock.mockReturnValue({
    '/att/daily-time/get': {
      insufficientRestTime: 20,
    },
    '/time-track/alert/list': { records: [] },
    '/att/daily-request/available/list': {
      availableRequestTypeCodesMap: { 'dummy-id': [] },
    },
    '/time-track/record/actual/get': { dailyRecordList: [] },
  });

  beforeEach(() => {
    ApiMock.reset();
  });

  it('should refresh time sheet', async () => {
    // Arrange
    const user = {
      id: 'test',
      employeeCode: '00A',
      employeeName: 'TESt USER',
      employeePhotoUrl: '',
      departmentCode: '', // Not used?
      departmentName: 'TEST DEP',
      title: 'TESTER',
      managerName: '',
      isDelegated: false,
    };
    const closeEvent = {
      dismissed: true,
      saved: true,
      timestamp: false,
      targetDate: '2020-06-01',
    };
    const store = mockStore(state);
    (
      UseCases().reloadTimesheetOnly as unknown as jest.Mock
    ).mockImplementationOnce(() => {
      store.dispatch({
        type: 'FETCH_TIMESHEET',
      });
      return Promise.resolve({ timesheet: 'timesheet' });
    });

    // Act
    // @ts-ignore
    await store.dispatch(closeDailySummary(closeEvent, user));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should refresh time sheet as delegated user', async () => {
    // Arrange
    const user = {
      id: 'test',
      employeeCode: '00A',
      employeeName: 'TESt USER',
      employeePhotoUrl: '',
      departmentCode: '', // Not used?
      departmentName: 'TEST DEP',
      title: 'TESTER',
      managerName: '',
      isDelegated: true,
    };
    const closeEvent = {
      dismissed: true,
      saved: true,
      timestamp: false,
      targetDate: '2020-06-01',
    };
    const store = mockStore(state);
    (
      UseCases().reloadTimesheetOnly as unknown as jest.Mock
    ).mockImplementationOnce(() => {
      store.dispatch({
        type: 'FETCH_TIMESHEET',
      });
      return Promise.resolve({ timesheet: 'timesheet' });
    });

    // Act
    // @ts-ignore
    await store.dispatch(closeDailySummary(closeEvent, user));

    // Assert
    expect(UseCases().reloadTimesheetOnly).toHaveBeenCalledWith({
      targetDate: '2020-06-01',
      employeeId: 'test',
    });
  });

  it('should verify insufficient rest time ', async () => {
    // Arrange
    const user = {
      id: 'test',
      employeeCode: '00A',
      employeeName: 'TESt USER',
      employeePhotoUrl: '',
      departmentCode: '', // Not used?
      departmentName: 'TEST DEP',
      title: 'TESTER',
      managerName: '',
      isDelegated: false,
    };
    const closeEvent = {
      dismissed: true,
      saved: true,
      timestamp: true,
      targetDate: '2020-06-01',
    };
    const store = mockStore(state);
    (
      UseCases().reloadTimesheetOnly as unknown as jest.Mock
    ).mockImplementationOnce(() => {
      store.dispatch({
        type: 'FETCH_TIMESHEET',
      });
      return Promise.resolve({ timesheet: 'timesheet' });
    });

    // Act
    // @ts-ignore
    await store.dispatch(closeDailySummary(closeEvent, user));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should not verify insufficient rest time if not clock-out ', async () => {
    // Arrange
    const user = {
      id: 'test',
      employeeCode: '00A',
      employeeName: 'TESt USER',
      employeePhotoUrl: '',
      departmentCode: '', // Not used?
      departmentName: 'TEST DEP',
      title: 'TESTER',
      managerName: '',
      isDelegated: false,
    };
    const closeEvent = {
      dismissed: true,
      saved: true,
      timestamp: false,
      targetDate: '2020-06-01',
    };
    const store = mockStore(state);
    (
      UseCases().reloadTimesheetOnly as unknown as jest.Mock
    ).mockImplementationOnce(() => {
      store.dispatch({
        type: 'FETCH_TIMESHEET',
      });
      return Promise.resolve({ timesheet: 'timesheet' });
    });

    // Act
    // @ts-ignore
    await store.dispatch(closeDailySummary(closeEvent, user));

    // Assert
    expect(ApiMock.invoke).toMatchSnapshot();
  });
});
