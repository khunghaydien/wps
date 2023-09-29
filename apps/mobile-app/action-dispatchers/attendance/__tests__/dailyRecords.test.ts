import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import RemoteError from '../../../../commons/errors/RemoteError';
import { showConfirm } from '../../../modules/commons/confirm';

import { Timesheet } from '../../../../domain/models/attendance/Timesheet';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import { AppDispatch } from '../../AppThunk';
import * as actions from '../dailyRecord';

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
jest.mock('../../../../commons/modules/toast', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showToast:
    (...args: any[]) =>
    (dispatch: AppDispatch): void => {
      dispatch({
        type: 'MOCK/COMMONS/MODULES/SHOW_TOAST',
        payload: args,
      });
    },
}));
jest.mock('../../../modules/commons/confirm', () => ({
  __esModule: true,
  showConfirm: jest.fn(),
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
  (showConfirm as unknown as jest.Mock).mockClear();
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
});

describe('saveAttDailyRecord()', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const $showConfirm = (...args: any[]) => ({
    type: 'MOCK/COMMONS/MODULES/SHOW_CONFIRM',
    payload: args,
  });

  it('should save record', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({
        insufficientRestTime: 0,
      })
      .mockResolvedValueOnce()
      .mockResolvedValueOnce();
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const editing = {
      id: 'id',
      targetDate: '2010-01-15',
      startTime: 9 * 60,
      endTime: 18 * 60,
      restTimes: [],
      restHours: 0,
      remarks: 'remarks',
      contractedDetail: null,
      canEdit: true,
      hasOtherRestTime: false,
      attentionMessages: [],
      commuteForwardCount: null,
      commuteBackwardCount: null,
    };

    // Act
    await dispatch(actions.saveAttDailyRecord(editing, true));

    // Arrange
    expect(ApiMock.invoke).toBeCalledTimes(3);
    expect(ApiMock.invoke).nthCalledWith(1, {
      path: '/att/daily-time/save',
      param: {
        empId: null,
        startTime: 9 * 60,
        endTime: 18 * 60,
        rest1StartTime: null,
        rest1EndTime: null,
        rest2StartTime: null,
        rest2EndTime: null,
        rest3StartTime: null,
        rest3EndTime: null,
        rest4StartTime: null,
        rest4EndTime: null,
        rest5StartTime: null,
        rest5EndTime: null,
        restHours: 0,
        targetDate: '2010-01-15',
      },
    });
    expect(ApiMock.invoke).nthCalledWith(2, {
      path: '/att/daily-remarks/save',
      param: {
        recordId: 'id',
        remarks: 'remarks',
      },
    });
    expect(ApiMock.invoke).nthCalledWith(3, {
      path: '/att/daily-commute-count/save',
      param: {
        empId: undefined,
        targetDate: '2010-01-15',
        commuteForwardCount: null,
        commuteBackwardCount: null,
      },
    });
    expect(store.getActions()).toMatchSnapshot();
    expect(showConfirm).not.toBeCalled();
  });

  it('should save record and fix insufficientRestTime if shoConfirm return true.', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({
        insufficientRestTime: 60,
      })
      .mockResolvedValueOnce()
      .mockResolvedValueOnce()
      .mockResolvedValueOnce();
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const editing = {
      id: 'id',
      targetDate: '2010-01-15',
      startTime: 9 * 60,
      endTime: 18 * 60,
      restTimes: [],
      restHours: 0,
      remarks: 'remarks',
      contractedDetail: null,
      canEdit: true,
      hasOtherRestTime: false,
      attentionMessages: [],
      commuteForwardCount: null,
      commuteBackwardCount: null,
    };
    (showConfirm as any).mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]) =>
        async (dispatch: AppDispatch): Promise<true> => {
          dispatch($showConfirm(...args));
          return true;
        }
    );

    // Act
    await dispatch(actions.saveAttDailyRecord(editing, true));

    // Arrange
    expect(ApiMock.invoke).nthCalledWith(1, {
      path: '/att/daily-time/save',
      param: {
        empId: null,
        startTime: 9 * 60,
        endTime: 18 * 60,
        rest1StartTime: null,
        rest1EndTime: null,
        rest2StartTime: null,
        rest2EndTime: null,
        rest3StartTime: null,
        rest3EndTime: null,
        rest4StartTime: null,
        rest4EndTime: null,
        rest5StartTime: null,
        rest5EndTime: null,
        restHours: 0,
        targetDate: '2010-01-15',
      },
    });
    expect(ApiMock.invoke).nthCalledWith(2, {
      path: '/att/daily-remarks/save',
      param: {
        recordId: 'id',
        remarks: 'remarks',
      },
    });
    expect(ApiMock.invoke).nthCalledWith(3, {
      path: '/att/daily-commute-count/save',
      param: {
        empId: undefined,
        targetDate: '2010-01-15',
        commuteForwardCount: null,
        commuteBackwardCount: null,
      },
    });
    expect(ApiMock.invoke).nthCalledWith(4, {
      path: '/att/daily-rest-time/fill',
      param: {
        empId: undefined,
        targetDate: '2010-01-15',
      },
    });
    expect(showConfirm).toBeCalled();
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should save record and dose not fix insufficientRestTime if shoConfirm return false.', async () => {
    // Arrange
    ApiMock.invoke
      .mockResolvedValueOnce({
        insufficientRestTime: 60,
      })
      .mockResolvedValueOnce()
      .mockResolvedValueOnce();
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const editing = {
      id: 'id',
      targetDate: '2010-01-15',
      startTime: 9 * 60,
      endTime: 18 * 60,
      restTimes: [],
      restHours: 0,
      remarks: 'remarks',
      contractedDetail: null,
      canEdit: true,
      hasOtherRestTime: false,
      attentionMessages: [],
      commuteForwardCount: null,
      commuteBackwardCount: null,
    };
    (showConfirm as any).mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]) =>
        async (dispatch: AppDispatch): Promise<false> => {
          dispatch($showConfirm(...args));
          return false;
        }
    );

    // Act
    await dispatch(actions.saveAttDailyRecord(editing, true));

    // Arrange
    expect(ApiMock.invoke).toBeCalledTimes(3);
    expect(ApiMock.invoke).nthCalledWith(1, {
      path: '/att/daily-time/save',
      param: {
        empId: null,
        startTime: 9 * 60,
        endTime: 18 * 60,
        rest1StartTime: null,
        rest1EndTime: null,
        rest2StartTime: null,
        rest2EndTime: null,
        rest3StartTime: null,
        rest3EndTime: null,
        rest4StartTime: null,
        rest4EndTime: null,
        rest5StartTime: null,
        rest5EndTime: null,
        restHours: 0,
        targetDate: '2010-01-15',
      },
    });
    expect(ApiMock.invoke).nthCalledWith(2, {
      path: '/att/daily-remarks/save',
      param: {
        recordId: 'id',
        remarks: 'remarks',
      },
    });
    expect(ApiMock.invoke).nthCalledWith(3, {
      path: '/att/daily-commute-count/save',
      param: {
        empId: undefined,
        targetDate: '2010-01-15',
        commuteForwardCount: null,
        commuteBackwardCount: null,
      },
    });
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should not save record if error occur.', async () => {
    // Arrange
    ApiMock.invoke.mockRejectedValueOnce(
      new RemoteError({
        isSuccess: false,
        error: {
          errorCode: 'test',
          message: 'error test',
          stackTrace: 'stackTrace',
          groupCode: 1,
        },
      })
    );
    const store = mockStore({});
    const dispatch = store.dispatch as AppDispatch;
    const editing = {
      id: 'id',
      targetDate: '2010-01-15',
      startTime: 9 * 60,
      endTime: 18 * 60,
      restTimes: [],
      restHours: 0,
      remarks: 'remarks',
      contractedDetail: null,
      canEdit: true,
      hasOtherRestTime: false,
      attentionMessages: [],
      commuteForwardCount: null,
      commuteBackwardCount: null,
    };

    // Act
    await expect(
      dispatch(actions.saveAttDailyRecord(editing, true))
    ).rejects.toThrow('error test');

    // Arrange
    expect(ApiMock.invoke).toBeCalledTimes(1);
    expect(store.getActions()).toMatchSnapshot();
    expect(showConfirm).not.toBeCalled();
  });
});
