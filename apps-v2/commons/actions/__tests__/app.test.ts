import { AnyAction } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';

import ApexError, { ApexEvent } from '../../errors/ApexError';
import FatalError from '../../errors/FatalError';
import RemoteError from '../../errors/RemoteError';
import * as appActions from '../app';
import {
  CATCH_API_ERROR,
  CATCH_UNEXPECTED_ERROR,
  ConfirmDialogOpenAction,
} from '../app';
import * as Sentry from '@sentry/react';

jest.mock('@sentry/react', () => {
  return {
    withScope: jest.fn().mockImplementation((callback) =>
      callback({
        setUser: jest.fn(),
        setExtra: jest.fn(),
      })
    ),
    setTag: jest.fn(),
    captureException: jest.fn(),
    getCurrentHub: jest.fn().mockReturnValue({
      getClient: jest.fn().mockReturnValue(true),
    }),
  };
});

beforeEach(() => {
  jest.clearAllMocks();

  (global as any).organization = {
    enableErrorTracking: true,
  };
});

const middlewares = [thunk];
const mockStore = configureMockStore<
  any,
  ThunkDispatch<undefined, undefined, AnyAction>
>(middlewares);

describe('confirm(message, callback)', () => {
  test(`${appActions.ConfirmDialogActionType.OPEN} が作成される`, () => {
    // arrange
    const message = 'Hello World!';
    const callback = jest.fn();
    const expected = {
      type: 'CONFIRM_DIALOG_OPEN',
      payload: {
        message,
        callback,
      },
    };

    const store = mockStore({ confirmDialog: null });

    // run
    store.dispatch(appActions.confirm(message, callback));
    const action = store.getActions()[0];

    // assert
    expect(action.type).toEqual(expected.type);
    expect(action.payload.message).toEqual(expected.payload.message);
    expect(typeof action.payload.callback).toBe('function');
  });

  describe('confirm(message, callback).callback()', () => {
    const callback = jest.fn();
    const store = mockStore({ confirmDialog: null });

    beforeEach(() => {});

    test(`${appActions.ConfirmDialogActionType.CLOSE} が作成される`, () => {
      // arrange
      const expected = {
        type: 'CONFIRM_DIALOG_CLOSE',
      };
      store.dispatch(appActions.confirm('hello world!', callback));

      // run
      const openAction = store.getActions()[0];
      openAction.payload.callback(true);

      // assert
      const closeAction = store.getActions()[1];
      expect(closeAction).toEqual(expected);
    });

    test(`コールバック処理が実行される`, () => {
      // run
      const action = store.dispatch(
        appActions.confirm('hello world!', callback)
      ) as ConfirmDialogOpenAction;

      // run
      action.payload.callback(true);

      // assert
      expect(callback).toHaveBeenCalledWith(true);

      // run
      action.payload.callback(false);

      // assert
      expect(callback).toHaveBeenCalledWith(false);
    });
  });
});

describe('catchApiError()', () => {
  it('should catch RemoteError', () => {
    // Arrange
    const store = mockStore();

    const remoteError = new RemoteError({
      isSuccess: false,
      error: {
        errorCode: 'remote error',
        message: 'remote error message',
        stackTrace: 'remote error stack trace',
        groupCode: 1,
      },
    });

    // Act
    store.dispatch(appActions.catchApiError(remoteError));

    // Assert
    const actual = store.getActions()[0];
    expect(actual).toEqual({
      payload: {
        errorCode: 'remote error',
        isContinuable: true,
        isFunctionCantUseError: false,
        message: 'APIエラー - remote error message',
        problem: 'remote error message',
        stackTrace: 'remote error stack trace',
        type: 'APIエラー',
      },
      type: CATCH_API_ERROR,
    });
  });
  it('should catch ApexError', () => {
    // Arrange
    const store = mockStore();

    const apexError = new ApexError({
      statusCode: 'FATAL',
      data: 'DATA',
      action: 'POST',
      message: 'Appliaction met unexpected error',
      where: 'RemoteApiController',
    } as unknown as ApexEvent);

    // Act
    store.dispatch(appActions.catchApiError(apexError));

    // Assert
    const actual = store.getActions()[0];
    expect(actual).toEqual({
      payload: apexError,
      type: CATCH_UNEXPECTED_ERROR,
    });
  });
  it('should catch Error', () => {
    // Arrange
    const store = mockStore();

    const error = new Error('error');
    error.stack = 'stack trace';

    // Act
    store.dispatch(appActions.catchApiError(error));

    // Assert
    const actual = store.getActions()[0];
    expect(actual).toEqual({
      payload: new FatalError({
        errorCode: undefined,
        message: 'error',
        name: 'Error',
        stack: 'stack trace',
        type: 'FatalError',
      } as Error),
      type: CATCH_UNEXPECTED_ERROR,
    });
  });
  it('should catch plain object representing error', () => {
    // Arrange
    const store = mockStore();

    const errorObj = {
      errorCode: 'error code',
      message: 'message',
      stackTrace: 'stack trace',
    };

    // Act
    store.dispatch(appActions.catchApiError(errorObj));

    // Assert
    const actual = store.getActions()[0];
    expect(actual).toEqual({
      payload: {
        errorCode: 'error code',
        isContinuable: true,
        isFunctionCantUseError: false,
        message: 'APIエラー - message',
        problem: 'message',
        stackTrace: 'stack trace',
        type: 'APIエラー',
      },
      type: CATCH_API_ERROR,
    });
  });
  it('should send RemoteError to Sentry', () => {
    // Arrange
    const store = mockStore();

    const remoteError = new RemoteError({
      isSuccess: false,
      error: {
        errorCode: 'remote error',
        message: 'remote error message',
        stackTrace: 'remote error stack trace',
        groupCode: 2,
      },
    });

    // Act
    store.dispatch(appActions.catchApiError(remoteError));

    // Assert
    expect(Sentry.captureException).toHaveBeenCalledWith(remoteError);
  });
  it('should send ApexError to Sentry', () => {
    // Arrange
    const store = mockStore();

    const apexError = new ApexError({
      statusCode: 'FATAL',
      data: 'DATA',
      action: 'POST',
      message: 'Appliaction met unexpected error',
      where: 'RemoteApiController',
    } as unknown as ApexEvent);

    // Act
    store.dispatch(appActions.catchApiError(apexError));

    // Assert
    expect(Sentry.captureException).toHaveBeenCalledWith(apexError);
  });
  it('should send Error to Sentry', () => {
    // Arrange
    const store = mockStore();

    const error = new Error('error');

    // Act
    store.dispatch(appActions.catchApiError(error));

    // Assert
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });
  it('should send plain object Error to Sentry', () => {
    // Arrange
    const store = mockStore();
    const { AppError } = appActions;

    const error = new AppError({
      message: 'plain object',
      stackTrace: 'stack trace',
      errorCode: 'test',
    });

    // Act
    store.dispatch(appActions.catchApiError(error));

    // Assert
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });
  it('should send RemoteError with stack trace', () => {
    // Arrange
    const setExtra = jest.fn();
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(Sentry, 'withScope', {
      value: jest.fn(),
    });
    (Sentry.withScope as jest.Mock).mockImplementation((callback) => {
      callback({
        setUser: jest.fn(),
        setExtra,
      });
    });

    const store = mockStore();

    const remoteError = new RemoteError({
      isSuccess: false,
      error: {
        errorCode: 'remote error',
        message: 'remote error message',
        stackTrace: 'remote error stack trace',
        groupCode: 2,
      },
    });

    // Act
    store.dispatch(appActions.catchApiError(remoteError));

    // Assert
    expect(setExtra).toHaveBeenCalledWith(
      'Stack Trace',
      'remote error stack trace'
    );
  });
  it('should send ApexError with stack trace', () => {
    // Arrange
    const setExtra = jest.fn();
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(Sentry, 'withScope', { value: jest.fn() as any });
    (Sentry.withScope as jest.Mock).mockImplementation((callback) => {
      callback({
        setUser: jest.fn(),
        setExtra,
      });
    });

    const store = mockStore();

    const error = new ApexError({
      statusCode: 'FATAL',
      data: 'DATA',
      action: 'POST',
      message: 'Application met unexpected error',
      where: 'RemoteApiController',
    } as unknown as ApexEvent);

    // Act
    store.dispatch(appActions.catchApiError(error));

    // Assert
    const actual = setExtra.mock.calls[0][1];
    expect(actual).toEqual(
      expect.stringMatching(/^Error: Application met unexpected error/)
    );
  });
  it('should send Error with stack trace', () => {
    // Arrange
    const setExtra = jest.fn();
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(Sentry, 'withScope', { value: jest.fn() as any });
    (Sentry.withScope as jest.Mock).mockImplementation((callback) => {
      callback({
        setUser: jest.fn(),
        setExtra,
      });
    });

    const store = mockStore();

    const error = new Error('Error');
    error.stack = 'error stack trace';

    // Act
    store.dispatch(appActions.catchApiError(error));

    // Assert
    expect(setExtra).toHaveBeenCalledWith('Stack Trace', 'error stack trace');
  });
  it('should send plain object Error with stack trace', () => {
    // Arrange
    const setExtra = jest.fn();
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(Sentry, 'withScope', { value: jest.fn() as any });
    (Sentry.withScope as jest.Mock).mockImplementation((callback) => {
      callback({
        setUser: jest.fn(),
        setExtra,
      });
    });

    const store = mockStore();

    const error = {
      message: 'plain object',
      stackTrace: 'stack trace',
      errorCode: 'test',
    };

    // Act
    store.dispatch(appActions.catchApiError(error));

    // Assert
    expect(setExtra).toHaveBeenCalledWith('Stack Trace', 'stack trace');
  });
  it('should not send business errors to Sentry', () => {
    // Arrange
    const store = mockStore();

    const remoteError = new RemoteError({
      isSuccess: false,
      error: {
        errorCode: 'remote error',
        message: 'remote error message',
        stackTrace: 'remote error stack trace',
        groupCode: 1,
      },
    });

    // Act
    store.dispatch(appActions.catchApiError(remoteError));

    // Assert
    expect(Sentry.captureException).not.toHaveBeenCalledWith(remoteError);
  });
  it('should not send system errors to Sentry if error tracking is disabled', () => {
    // Arrange
    (global as any).organization.enableErrorTracking = false;

    const store = mockStore();

    const remoteError = new RemoteError({
      isSuccess: false,
      error: {
        errorCode: 'remote error',
        message: 'remote error message',
        stackTrace: 'remote error stack trace',
        groupCode: 2,
      },
    });

    // Act
    store.dispatch(appActions.catchApiError(remoteError));

    // Assert
    expect(Sentry.captureException).not.toHaveBeenCalledWith(remoteError);
  });
});
