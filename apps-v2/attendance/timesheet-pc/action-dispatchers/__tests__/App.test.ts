import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getUserSetting } from '@apps/commons/actions/userSetting';
import { actions as standaloneModeActions } from '@apps/commons/modules/standaloneMode';

import EmployeeRepository from '@apps/repositories/EmployeeRepository';

import { Permission } from '@apps/domain/models/access-control/Permission';

import { AppDispatch } from '@attendance/timesheet-pc/action-dispatchers/AppThunk';
import { initDailyStampTime } from '@attendance/timesheet-pc/action-dispatchers/StampWidget';

import UseCases from '../../UseCases';
import * as App from '../App';
import EventEmitter from '@apps/attendance/libraries/Event/emitter';
import Events from '@attendance/timesheet-pc/events';

const mockStore = configureMockStore([thunk]);

jest.mock('../Timesheet');
jest.mock('../../../../commons/actions/userSetting');
jest.mock('../StampWidget');
jest.mock('../TimeTrackAlert');
jest.mock('../DailyTimeTrack');
jest.mock('../../../../repositories/EmployeeRepository');
jest.mock('../../UseCases');
jest.mock('@attendance/libraries/Event/emitter');

const spyOnStandaloneModeActionsEnable = jest.spyOn(
  standaloneModeActions,
  'enable'
);

const reloadTimesheet = () => ({
  type: 'RELOAD_TIMESHEET',
});

beforeEach(() => {
  jest.clearAllMocks();
  (UseCases().fetchTimesheet as unknown as jest.Mock).mockReset();
  Object.defineProperty(window, 'location', {
    get: () => ({
      search: '',
    }),
  });
  (getUserSetting as jest.Mock).mockImplementation(
    (...args) =>
      (dispatch: AppDispatch) => {
        dispatch({
          type: 'GET_USER_SETTING',
          payload: args,
        });
        return Promise.resolve({});
      }
  );
  (initDailyStampTime as jest.Mock).mockImplementation(
    (...args) =>
      (dispatch: AppDispatch) => {
        dispatch({ type: 'INIT_DAILY_STAMP_TIME', payload: args });
        return Promise.resolve();
      }
  );
});

describe('initialize()', () => {
  it('should do with Login User.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const fetchedTimesheet = {
      timesheet: {
        workingTypeList: [
          {
            useAllowanceManagement: false,
          },
        ],
      },
    };
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () => {
        dispatch(reloadTimesheet());
        return Promise.resolve(fetchedTimesheet);
      }
    );

    // Act
    await dispatch(App.initialize({ userPermission: {} as Permission }));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(spyOnStandaloneModeActionsEnable).toBeCalledTimes(0);
    expect(UseCases().fetchTimesheet).toBeCalledWith({
      targetDate: null,
      employeeId: null,
    });
    expect(initDailyStampTime).toBeCalledTimes(1);
    expect(EmployeeRepository.search).toBeCalledTimes(0);
    expect(EventEmitter.publish).toBeCalledWith(Events.initialized.eventName, {
      fetchedUserSetting: {},
      fetchedTimesheet,
    });
  });

  it('should return if timesheet is null.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const fetchedTimesheet = {
      timesheet: null,
    };
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () => {
        dispatch(reloadTimesheet());
        return Promise.resolve(fetchedTimesheet);
      }
    );

    // Act
    await dispatch(App.initialize({ userPermission: {} as Permission }));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(EventEmitter.publish).not.toBeCalledWith(
      Events.initialized.eventName,
      {
        fetchedUserSetting: {},
        fetchedTimesheet,
      }
    );
  });

  it('should return if isMigratedSummary is false.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const fetchedTimesheet = {
      timesheet: {
        isMigratedSummary: true,
        startDate: '2020-01-01',
        endDate: '2020-01-31',
      },
    };
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () => {
        dispatch(reloadTimesheet());
        return Promise.resolve(fetchedTimesheet);
      }
    );

    // Act
    await dispatch(App.initialize({ userPermission: {} as Permission }));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(EventEmitter.publish).not.toBeCalledWith(
      Events.initialized.eventName,
      {
        fetchedUserSetting: {},
        fetchedTimesheet,
      }
    );
  });

  it('should return error if UseCases().reloadTimesheet() throw Error.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const error = new Error('Test Error');
    error.stack = null;
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () => {
        dispatch(reloadTimesheet());
        return Promise.reject(error);
      }
    );
    // Act
    await dispatch(App.initialize({ userPermission: {} as Permission }));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(EventEmitter.publish).not.toHaveBeenCalled();
  });

  it('should do with Login User and specified date.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const targetDate = '2021-12-01';
    const fetchedTimesheet = {
      timesheet: {
        workingTypeList: [
          {
            useAllowanceManagement: false,
          },
        ],
      },
    };

    Object.defineProperty(window, 'location', {
      get: () => ({
        search: `?targetDate=${targetDate}`,
      }),
    });
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () => {
        dispatch(reloadTimesheet());
        return Promise.resolve(fetchedTimesheet);
      }
    );

    // Act
    await dispatch(App.initialize({ userPermission: {} as Permission }));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(spyOnStandaloneModeActionsEnable).toBeCalledTimes(0);
    expect(UseCases().fetchTimesheet).toBeCalledWith({
      targetDate,
      employeeId: undefined,
    });
    expect(initDailyStampTime).toBeCalledTimes(1);
    expect(EmployeeRepository.search).toBeCalledTimes(0);
    expect(EventEmitter.publish).toBeCalledWith(Events.initialized.eventName, {
      fetchedUserSetting: {},
      fetchedTimesheet,
    });
  });

  it('should not do if error is occurred.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    (getUserSetting as jest.Mock).mockImplementationOnce(() => () => {
      const error = new Error();
      error.stack = null;
      throw error;
    });
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
    await dispatch(App.initialize({ userPermission: {} as Permission }));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(EventEmitter.publish).not.toHaveBeenCalled();
  });

  describe('with parameters', () => {
    it('should do with proxy.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      const employeeId = 'empId';
      const targetDate = '2021-12-01';
      Object.defineProperty(window, 'location', {
        get: () => ({
          search: `?empId=${employeeId}&targetDate=${targetDate}`,
        }),
      });
      const fetchedUserSetting = {
        useWorkTime: true,
      };
      (getUserSetting as jest.Mock).mockImplementationOnce(
        (...args) =>
          (dispatch: AppDispatch) => {
            // @ts-ignore
            dispatch(getUserSetting(...args));
            return fetchedUserSetting;
          }
      );
      const fetchedTimesheet = {
        timesheet: {
          workingTypeList: [
            {
              useAllowanceManagement: false,
            },
          ],
        },
      };
      (
        UseCases().fetchTimesheet as unknown as jest.Mock
      ).mockImplementationOnce(() => {
        dispatch(reloadTimesheet());
        return Promise.resolve(fetchedTimesheet);
      });

      // Act
      await dispatch(
        App.initialize({
          userPermission: {
            viewTimeTrackByDelegate: true,
          } as Permission,
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(spyOnStandaloneModeActionsEnable).toBeCalledTimes(0);
      expect(UseCases().fetchTimesheet).toBeCalledWith({
        targetDate,
        employeeId,
      });
      expect(initDailyStampTime).toBeCalledTimes(0);
      expect(EmployeeRepository.search).toBeCalledTimes(1);
      expect(EmployeeRepository.search).toBeCalledWith({
        id: employeeId,
        targetDate,
      });
      expect(EventEmitter.publish).toBeCalledWith(
        Events.initialized.eventName,
        {
          fetchedUserSetting,
          fetchedTimesheet,
        }
      );
    });

    it('should do with proxy and standalone.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      const employeeId = 'empId';
      const targetDate = '2021-12-01';
      const standalone = '1';
      Object.defineProperty(window, 'location', {
        get: () => ({
          search: `?empId=${employeeId}&targetDate=${targetDate}&standalone=${standalone}`,
        }),
      });
      const fetchedUserSetting = {
        useWorkTime: true,
      };
      (getUserSetting as jest.Mock).mockImplementationOnce(
        (...args) =>
          (dispatch: AppDispatch) => {
            // @ts-ignore
            dispatch(getUserSetting(...args));
            return fetchedUserSetting;
          }
      );
      const fetchedTimesheet = {
        timesheet: {
          workingTypeList: [
            {
              useAllowanceManagement: false,
            },
          ],
        },
      };
      (
        UseCases().fetchTimesheet as unknown as jest.Mock
      ).mockImplementationOnce(() => {
        dispatch(reloadTimesheet());
        return Promise.resolve(fetchedTimesheet);
      });

      // Act
      await dispatch(
        App.initialize({
          userPermission: {
            viewTimeTrackByDelegate: true,
          } as Permission,
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(spyOnStandaloneModeActionsEnable).toBeCalledTimes(1);
      expect(spyOnStandaloneModeActionsEnable).toBeCalledWith();
      expect(UseCases().fetchTimesheet).toBeCalledWith({
        targetDate,
        employeeId,
      });
      expect(initDailyStampTime).toBeCalledTimes(0);
      expect(EmployeeRepository.search).toBeCalledTimes(1);
      expect(EmployeeRepository.search).toBeCalledWith({
        id: employeeId,
        targetDate,
      });
      expect(EventEmitter.publish).toBeCalledWith(
        Events.initialized.eventName,
        {
          fetchedUserSetting,
          fetchedTimesheet,
        }
      );
    });

    it('should not do if targetDate is null with proxy.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      const employeeId = 'empId';
      Object.defineProperty(window, 'location', {
        get: () => ({
          search: `?empId=${employeeId}`,
        }),
      });
      const fetchedUserSetting = {
        useWorkTime: true,
      };
      (getUserSetting as jest.Mock).mockImplementationOnce(
        (...args) =>
          (dispatch: AppDispatch) => {
            // @ts-ignore
            dispatch(getUserSetting(...args));
            return fetchedUserSetting;
          }
      );
      const fetchedTimesheet = {
        timesheet: {
          workingTypeList: [
            {
              useAllowanceManagement: false,
            },
          ],
        },
      };
      (
        UseCases().fetchTimesheet as unknown as jest.Mock
      ).mockImplementationOnce(() => {
        dispatch(reloadTimesheet());
        return Promise.resolve(fetchedTimesheet);
      });

      // Act
      await dispatch(
        App.initialize({
          userPermission: {
            viewTimeTrackByDelegate: true,
          } as Permission,
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(spyOnStandaloneModeActionsEnable).toBeCalledTimes(0);
      expect(UseCases().fetchTimesheet).toBeCalledWith({
        targetDate: undefined,
        employeeId,
      });
      expect(initDailyStampTime).toBeCalledTimes(0);
      expect(EmployeeRepository.search).toBeCalledTimes(1);
      expect(EmployeeRepository.search).toBeCalledWith({
        id: employeeId,
        targetDate: undefined,
      });
      expect(EventEmitter.publish).toBeCalledWith(
        Events.initialized.eventName,
        {
          fetchedUserSetting,
          fetchedTimesheet,
        }
      );
    });
  });
});

describe('switchProxyEmployee()', () => {
  it('should do.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const targetDate = '2022-01-01';
    const employeeId = 'employeeId';
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
    const result = await dispatch(
      App.switchProxyEmployee(targetDate, { id: employeeId })
    );

    // Assert
    expect(result).toBe(true);
    expect(store.getActions()).toMatchSnapshot();
    expect(UseCases().fetchTimesheet).toBeCalledTimes(1);
    expect(UseCases().fetchTimesheet).toBeCalledWith({
      targetDate,
      employeeId,
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
          },
        });
      }
    );

    // Act
    await dispatch(App.onStampSuccess());

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should not do if UseCases().reloadTimesheet throw Error.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const targetDate = '2022-01-01';
    const employeeId = 'employeeId';
    const error = new Error('Test Error');
    error.stack = null;
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () => {
        dispatch(reloadTimesheet());
        return Promise.reject(error);
      }
    );

    // Act
    const result = await dispatch(
      App.switchProxyEmployee(targetDate, { id: employeeId })
    );

    // Assert
    expect(result).toBe(false);
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should not do if error is occurred.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const targetDate = '2022-01-01';
    const employeeId = 'employeeId';
    (UseCases().fetchTimesheet as unknown as jest.Mock).mockImplementationOnce(
      () => {
        dispatch(reloadTimesheet());
        const error = new Error();
        error.stack = null;
        throw error;
      }
    );

    // Act
    const result = await dispatch(
      App.switchProxyEmployee(targetDate, { id: employeeId })
    );

    // Assert
    expect(result).toBe(false);
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('onStampSuccess()', () => {
  it('should do.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;

    // Act
    await dispatch(App.onStampSuccess());

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(EventEmitter.publish).toBeCalledTimes(1);
    expect(EventEmitter.publish).toBeCalledWith(
      Events.stampedTime.eventName,
      undefined
    );
  });
});
