import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import DateUtil from '@apps/commons/utils/DateUtil';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';

import createControllers from '../controllers';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

jest.mock('@attendance/timesheet-pc-importer/UseCases');
jest.spyOn(DateUtil, 'getToday').mockImplementation(() => '2023-01-01');

const mockStore = configureMockStore([thunkMiddleware]);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('openProxyEmployeeSelector', () => {
  it('should call with leggedInEmployee', async () => {
    // Arrange
    const store = mockStore({
      common: {
        userSetting: {
          employeeId: 'leggedInEmployeeId',
          departmentId: 'leggedInDepartmentId',
          companyId: 'leggedInCompanyId',
        },
      },
    });
    // Mock しないと API の呼び出しが実行されてしまう
    jest
      .spyOn(actions.widgets.ProxyEmployeeSelectDialog, 'show')
      .mockImplementation(
        (...args) =>
          (dispatch) =>
            dispatch({
              type: 'TEST:SHOW_PROXY_EMPLOYEE_SELECT_DIALOG',
              payload: args,
            })
      );
    const controllers = createControllers(store as AppStore);

    // Act
    await controllers.openProxyEmployeeSelector();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should call with delegatedEmployee', async () => {
    // Arrange
    const store = mockStore({
      common: {
        userSetting: {
          employeeId: 'leggedInEmployeeId',
          departmentId: 'leggedInDepartmentId',
          companyId: 'leggedInCompanyId',
        },
        proxyEmployeeInfo: {
          id: 'delegatedEmployeeId',
        },
      },
    });
    // Mock しないと API の呼び出しが実行されてしまう
    jest
      .spyOn(actions.widgets.ProxyEmployeeSelectDialog, 'show')
      .mockImplementation(
        (...args) =>
          (dispatch) =>
            dispatch({
              type: 'TEST:SHOW_PROXY_EMPLOYEE_SELECT_DIALOG',
              payload: args,
            })
      );
    const controllers = createControllers(store as AppStore);

    // Act
    await controllers.openProxyEmployeeSelector();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
