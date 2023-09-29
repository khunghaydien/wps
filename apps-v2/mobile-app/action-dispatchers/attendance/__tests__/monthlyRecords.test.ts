import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Timesheet } from '@attendance/domain/models/Timesheet';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import { AppDispatch } from '../../AppThunk';
import * as actions from '../monthlyRecords';
import { loadTimesheet } from '../timesheet';

jest.mock('uuid/v4', () => ({
  __esModule: true,
  default: (): string => 'TEST UUID V4',
}));
jest.mock('@apps/commons/actions/userSetting', () => ({
  __esModule: true,
  getUserSetting:
    (...args: unknown[]) =>
    (dispatch: AppDispatch): void => {
      dispatch({
        type: 'MOCK/COMMONS/ACTIONS/GET_USER_SETTING',
        payload: args,
      });
    },
}));
jest.mock('../timesheet', () => ({
  __esModule: true,
  loadTimesheet: jest.fn(
    (...args: unknown[]): string => `Mock timesheet(${args.join(',')})`
  ),
}));

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  ApiMock.reset();
});

describe('initialize()', () => {
  it('should fetch timesheet when nothing arguments.', async () => {
    // Arrange
    Date.now = jest.fn(() => new Date(2020, 9, 15).valueOf());
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;

    // Act
    await dispatch(actions.initialize());

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

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
    } as unknown as Timesheet;

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
    } as unknown as Timesheet;

    // Act
    await dispatch(actions.initialize(targetDate, timesheet));

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should fetch approval request histories.', async () => {
    // Arrange
    Date.now = jest.fn(() => new Date(2020, 9, 15).valueOf());
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    ApiMock.invoke.mockResolvedValueOnce({ historyList: [] });
    const timesheet = {
      requestId: '0001',
    } as unknown as Timesheet;
    (loadTimesheet as jest.Mock).mockReturnValueOnce(timesheet);

    // Act
    await dispatch(actions.initialize());

    // Assert
    expect(store.getActions()).toMatchSnapshot();
    expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
  });
});
