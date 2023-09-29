import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { showConfirm } from '@mobile/modules/commons/confirm';

import STATUS from '@apps/domain/models/approval/request/Status';
import {
  ACTIONS_FOR_FIX,
  STATUS as FIX_MONTHLY_REQUEST_STATUS,
} from '@attendance/domain/models/AttFixSummaryRequest';

import { defaultValue } from '@mobile/modules/attendance/timesheet/__tests__/mocks/entities/attDailyRecord';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import { AppDispatch } from '../../AppThunk';
import * as actions from '../attendanceRequest';
import { initialize as initializeMonthlyRecords } from '../monthlyRecords';
import askIgnoreWarning from '../userPrompts/askAttendanceRequestIgnoreWarning';

const mockStore = configureMockStore([thunk]);

jest.mock('uuid/v4', () => ({
  __esModule: true,
  default: (): string => 'TEST UUID V4',
}));
jest.mock('@mobile/modules/commons/confirm', () => ({
  __esModule: true,
  showConfirm: jest.fn(),
}));
jest.mock('../monthlyRecords', () => ({
  __esModule: true,
  initialize: jest.fn(),
}));
jest.mock('../userPrompts/askAttendanceRequestIgnoreWarning');

const $showConfirm = (...args: unknown[]) => ({
  type: 'MOCK/COMMONS/MODULES/SHOW_CONFIRM',
  payload: args,
});

const $initializeMonthlyRecords =
  (...args: unknown[]) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: 'MOCK/ATTENDANCE/MODULES/INITIALIZE_MONTH_RECORDS',
      payload: args,
    });
  };

beforeEach(() => {
  ApiMock.reset();
  (showConfirm as jest.Mock).mockReset();
});

describe('interact()', () => {
  describe('submit', () => {
    it('Reject request if you answer no about confirm request.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return false;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: null,
            status: FIX_MONTHLY_REQUEST_STATUS.NOT_REQUESTED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });

    it('Reject request if records have rejected request.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: null,
            status: FIX_MONTHLY_REQUEST_STATUS.NOT_REQUESTED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          },
          records: [
            {
              ...defaultValue,
              remarkableRequestStatus: {
                count: 1,
                status: STATUS.Approved,
              },
            },
            {
              ...defaultValue,
              remarkableRequestStatus: {
                count: 1,
                status: STATUS.Rejected,
              },
            },
          ],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });

    it('Reject request if records have canceled request.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: null,
            status: FIX_MONTHLY_REQUEST_STATUS.NOT_REQUESTED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          },
          records: [
            {
              ...defaultValue,
              remarkableRequestStatus: {
                count: 1,
                status: STATUS.Approved,
              },
            },
            {
              ...defaultValue,
              remarkableRequestStatus: {
                count: 1,
                status: STATUS.Canceled,
              },
            },
          ],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });

    it('Reject request if records have Recalled request.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: null,
            status: FIX_MONTHLY_REQUEST_STATUS.NOT_REQUESTED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          },
          records: [
            {
              ...defaultValue,
              remarkableRequestStatus: {
                count: 1,
                status: STATUS.Approved,
              },
            },
            {
              ...defaultValue,
              remarkableRequestStatus: {
                count: 1,
                status: STATUS.Recalled,
              },
            },
          ],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });

    it('Reject request if records have ApprovalIn request.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: null,
            status: FIX_MONTHLY_REQUEST_STATUS.NOT_REQUESTED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          },
          records: [
            {
              ...defaultValue,
              remarkableRequestStatus: {
                count: 1,
                status: STATUS.Approved,
              },
            },
            {
              ...defaultValue,
              remarkableRequestStatus: {
                count: 1,
                status: STATUS.ApprovalIn,
              },
            },
          ],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });

    it('Reject request if you answer no about question from server.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke.mockResolvedValueOnce({
        confirmation: ['Error 1', 'Error 2'],
      });
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );
      (askIgnoreWarning as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return false;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: null,
            status: FIX_MONTHLY_REQUEST_STATUS.NOT_REQUESTED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });

    it('Reject request if server return fails.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke.mockResolvedValueOnce({}).mockRejectedValueOnce({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: null,
            status: FIX_MONTHLY_REQUEST_STATUS.NOT_REQUESTED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });

    it('Resolve request but initializing is fails.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke.mockResolvedValueOnce({}).mockResolvedValueOnce({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );
      (initializeMonthlyRecords as jest.Mock).mockImplementationOnce(() => {
        const error = new Error('initializing is fails.');
        error.stack = '';
        throw error;
      });

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: null,
            status: FIX_MONTHLY_REQUEST_STATUS.NOT_REQUESTED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });

    it('Resolve request if you answer yes about question from server.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke
        .mockResolvedValueOnce({
          confirmation: ['Error 1', 'Error 2'],
        })
        .mockResolvedValueOnce({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );
      (askIgnoreWarning as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );
      (initializeMonthlyRecords as jest.Mock).mockImplementationOnce(
        $initializeMonthlyRecords
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: null,
            status: FIX_MONTHLY_REQUEST_STATUS.NOT_REQUESTED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });

    it('Resolve request.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke.mockResolvedValueOnce({}).mockResolvedValueOnce({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );
      (initializeMonthlyRecords as jest.Mock).mockImplementationOnce(
        $initializeMonthlyRecords
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: null,
            status: FIX_MONTHLY_REQUEST_STATUS.NOT_REQUESTED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.Submit,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });
  });

  describe('cancelRequest', () => {
    it('Reject request if you answer no about confirm request.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return false;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: '00002',
            status: FIX_MONTHLY_REQUEST_STATUS.PENDING,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.CancelRequest,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });

    it('Reject request if server return fails.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke.mockRejectedValueOnce({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: '00002',
            status: FIX_MONTHLY_REQUEST_STATUS.PENDING,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.CancelRequest,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });

    it('Resolve request but initializing is fails.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke.mockResolvedValueOnce({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );
      (initializeMonthlyRecords as jest.Mock).mockImplementationOnce(() => {
        const error = new Error('initializing is fails.');
        error.stack = '';
        throw error;
      });

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: '00002',
            status: FIX_MONTHLY_REQUEST_STATUS.PENDING,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.CancelRequest,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });

    it('Resolve request.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke.mockResolvedValueOnce({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );
      (initializeMonthlyRecords as jest.Mock).mockImplementationOnce(
        $initializeMonthlyRecords
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: '00002',
            status: FIX_MONTHLY_REQUEST_STATUS.PENDING,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.CancelRequest,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });
  });

  describe('cancelApproval', () => {
    it('Reject request if you answer no about confirm request.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return false;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: '00002',
            status: FIX_MONTHLY_REQUEST_STATUS.APPROVED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.CancelApproval,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });

    it('Reject request if server return fails.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke.mockRejectedValueOnce({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: '00002',
            status: FIX_MONTHLY_REQUEST_STATUS.APPROVED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.CancelApproval,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });

    it('Resolve request but initializing is fails.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke.mockResolvedValueOnce({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );
      (initializeMonthlyRecords as jest.Mock).mockImplementationOnce(() => {
        const error = new Error('initializing is fails.');
        error.stack = '';
        throw error;
      });

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: '00002',
            status: FIX_MONTHLY_REQUEST_STATUS.APPROVED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.CancelApproval,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });

    it('Resolve request.', async () => {
      // Arrange
      const store = mockStore({});
      const dispatch = store.dispatch as AppDispatch;
      ApiMock.invoke.mockResolvedValueOnce({});
      (showConfirm as jest.Mock).mockImplementationOnce(
        (...args: unknown[]) =>
          async (dispatch: AppDispatch): Promise<boolean> => {
            dispatch($showConfirm(...args));
            return true;
          }
      );
      (initializeMonthlyRecords as jest.Mock).mockImplementationOnce(
        $initializeMonthlyRecords
      );

      // Act
      await dispatch(
        actions.interact({
          targetDate: '2020-01-01',
          request: {
            summaryId: '00001',
            requestId: '00002',
            status: FIX_MONTHLY_REQUEST_STATUS.APPROVED,
            comment: 'comment',
            performableActionForFix: ACTIONS_FOR_FIX.CancelApproval,
          },
          records: [],
        })
      );

      // Assert
      expect(store.getActions()).toMatchSnapshot();
      expect(ApiMock.invoke.mock.calls).toMatchSnapshot();
    });
  });
});
