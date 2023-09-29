import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { State as TimesheetState } from '../../../modules/attendance/timesheet/entities';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import { AppDispatch } from '../../AppThunk';
import * as actions from '../dailyRequest';

jest.mock('uuid/v4', () => ({
  __esModule: true,
  default: (): string => 'TEST UUID V4',
}));
jest.mock('../../../../commons/actions/userSetting', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserSetting:
    (...args: any[]) =>
    (dispatch: AppDispatch): void => {
      dispatch({
        type: 'MOCK/COMMONS/ACTIONS/GET_USER_SETTING',
        payload: args,
      });
    },
}));
jest.mock('../timesheet', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadTimesheet: (...args: any[]): string =>
    `Mock timesheet(${args.join(',')})`,
}));

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  ApiMock.reset();
});

describe('initialize()', () => {
  it('should fetch timesheet when nothing cache.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const targetDate = '2010-01-01';

    // Act
    await dispatch(actions.initialize(targetDate));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should fetch timesheet when outside period cache.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const targetDate = '2020-03-01';
    const timesheet = {
      startDate: '2010-01-01',
      endDate: '2010-01-31',
    } as unknown as TimesheetState;

    // Act
    await dispatch(actions.initialize(targetDate, timesheet));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should not fetch timesheet when having cache.', async () => {
    // Arrange
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const targetDate = '2010-01-15';
    const timesheet = {
      startDate: '2010-01-01',
      endDate: '2010-01-31',
    } as unknown as TimesheetState;

    // Act
    await dispatch(actions.initialize(targetDate, timesheet));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
