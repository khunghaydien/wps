import isNil from 'lodash/isNil';

import { AppDispatch } from '../modules/AppThunk';

import { CustomConfirmDialogComponent } from '../components/dialogs/ConfirmDialog';

import ApexError from '../errors/ApexError';
import BusinessError from '../errors/BusinessError';
import { createErrorInfo, ErrorInfo } from '../errors/ErrorInfo';
import FatalError from '../errors/FatalError';
import RemoteError from '../errors/RemoteError';
import * as Sentry from '@sentry/react';

export const LOADING_START = 'LOADING_START';
export const LOADING_END = 'LOADING_END';
export const CATCH_API_ERROR = 'CATCH_API_ERROR';
export const CATCH_UNEXPECTED_ERROR = 'CATCH_UNEXPECTED_ERROR';
export const CATCH_BUSINESS_ERROR = 'CATCH_BUSINESS_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

type Payload = { areas?: string; loadingHint?: string };
export type LoadingStartAction = {
  type: 'LOADING_START';
  payload?: Payload;
};

export function loadingStart(payload?: Payload): LoadingStartAction {
  return payload
    ? {
        type: LOADING_START,
        payload,
      }
    : {
        type: LOADING_START,
      };
}

export type LoadingEndAction = {
  type: 'LOADING_END';
  payload?: string;
};

export function loadingEnd(areas?: string): LoadingEndAction {
  return areas
    ? {
        type: LOADING_END,
        payload: areas,
      }
    : {
        type: LOADING_END,
      };
}

export const withLoading =
  <T>(...processes: Array<(arg0: any) => Promise<T | any> | any>) =>
  (dispatch: AppDispatch): Promise<T | any> => {
    dispatch(loadingStart());
    return processes
      .reduce((acc, process) => acc.then(process), Promise.resolve())
      .then((result) => {
        dispatch(loadingEnd());
        return result;
      })
      .catch((err) => {
        dispatch(loadingEnd());
        throw err;
      });
  };

export const withHintLoading =
  <T>(
    loadingHint: string,
    ...processes: Array<(arg0: any) => Promise<T | any> | any>
  ) =>
  (dispatch: AppDispatch): Promise<T | any> => {
    dispatch(loadingStart({ loadingHint }));
    return processes
      .reduce((acc, process) => acc.then(process), Promise.resolve())
      .then((result) => {
        dispatch(loadingEnd());
        return result;
      })
      .catch((err) => {
        dispatch(loadingEnd());
        throw err;
      });
  };

/**
 * Confirm Dialog
 */

/**
 * Confirm Dialog を開くアクション
 */
export type ConfirmDialogOpenAction = {
  type: 'CONFIRM_DIALOG_OPEN';
  payload: {
    Component: CustomConfirmDialogComponent<any>;
    params: {
      [key: string]: any;
    };
    callback: (arg0: boolean) => void;
  };
};

/**
 * Confirm Dialog を閉じるアクション
 */
export type ConfirmDialogCloseAction = {
  type: 'CONFIRM_DIALOG_CLOSE';
};

/**
 * Confirm Dialogのアクション型
 * @type {[type]}
 */
export type ConfirmDialogAction =
  | ConfirmDialogOpenAction
  | ConfirmDialogCloseAction;

type $ConfirmDialogActionType = {
  OPEN: ConfirmDialogOpenAction['type'];
  CLOSE: ConfirmDialogCloseAction['type'];
};

/**
 * Confirm Dialog に送れる型
 */
export type ConfirmDialogProps<T> =
  | string
  | string[]
  | {
      Component: CustomConfirmDialogComponent<T>;
      params: T;
    };

/**
 * Confirm Dialog のアクション
 */
export const ConfirmDialogActionType: $ConfirmDialogActionType = {
  OPEN: 'CONFIRM_DIALOG_OPEN',
  CLOSE: 'CONFIRM_DIALOG_CLOSE',
};

/**
 * Confirm Dialogを開きます。
 *
 * callback は非推奨になります。
 * 今後は confirm ダイアログから返される Promise の中で処理してください。
 */
export const confirm =
  <T>(props: ConfirmDialogProps<T>, callback?: (arg0: boolean) => void) =>
  (dispatch: AppDispatch) => {
    let params;

    if (
      props !== null &&
      props !== undefined &&
      typeof props === 'object' &&
      !Array.isArray(props)
    ) {
      params = { ...props };
    } else {
      params = {
        message: props,
      };
    }

    const createAction = (
      args: {
        [key: string]: any;
      },
      next: (arg0: boolean) => void
    ) => {
      return dispatch({
        type: ConfirmDialogActionType.OPEN,
        payload: {
          ...args,
          callback: (yes: boolean) => {
            dispatch({ type: ConfirmDialogActionType.CLOSE });
            next(yes);
          },
        },
      });
    };

    if (callback) {
      return createAction(params, callback);
    } else {
      return new Promise((resolve) =>
        createAction(params, resolve)
      ) as Promise<boolean>;
    }
  };

/**
 * [END] Confirm Dialog
 */
export type CatchBusinessErrorAction = {
  type: 'CATCH_BUSINESS_ERROR';
  payload: BusinessError;
};

/**
 * Action to catch and store a business error.
 */
export function catchBusinessError(
  type: string,
  problem: string,
  solution: null | string,
  options: {
    errorCode?: string;
    message?: string;
    stackTrace?: string;
    isContinuable?: boolean;
  } = {},
  isFunctionCantUseError = false
): CatchBusinessErrorAction {
  return {
    type: CATCH_BUSINESS_ERROR,
    payload: new BusinessError(
      type,
      problem,
      solution,
      options,
      isFunctionCantUseError
    ),
  };
}

export type CatchApiErrorAction = {
  type: 'CATCH_API_ERROR';
  payload: ErrorInfo;
};

export type CatchUnexpectedErrorAction = {
  type: 'CATCH_UNEXPECTED_ERROR';
  payload: FatalError | ApexError;
};

export type CatchError = CatchApiErrorAction | CatchUnexpectedErrorAction;

type CustomError = {
  errorCode: string;
  message: string;
  stackTrace?: string;
  stack?: string;
};

export class AppError extends Error {
  constructor(error) {
    super(error.message);
    this.name = error.name ? error.name : this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function catchApiError(
  apiErr: Error | ApexError | RemoteError | CustomError,
  options: { isContinuable?: boolean } = { isContinuable: true }
): CatchError {
  const isSystemError =
    !(apiErr instanceof RemoteError) ||
    (apiErr instanceof RemoteError && apiErr.groupCode >= 2);
  if (
    isSystemError &&
    window.organization &&
    window.organization.enableErrorTracking &&
    !isNil(Sentry.getCurrentHub().getClient())
  ) {
    Sentry.withScope((scope) => {
      if (apiErr.stack) {
        scope.setExtra('Stack Trace', apiErr.stack);
      } else if ((apiErr as CustomError).stackTrace) {
        scope.setExtra('Stack Trace', (apiErr as CustomError).stackTrace);
      }
      const { message, path } = apiErr as RemoteError;
      const name = path ? 'APIError' : '';
      Sentry.setTag('api.path', path);
      Sentry.captureException(new AppError({ message, name }));
    });
  }

  if (apiErr instanceof RemoteError) {
    return {
      type: CATCH_API_ERROR,
      payload: createErrorInfo(
        'APIエラー',
        apiErr.errorCode,
        apiErr.message,
        apiErr.stackTrace || '',
        options.isContinuable
      ),
    };
  } else if (apiErr instanceof ApexError) {
    return {
      type: CATCH_UNEXPECTED_ERROR,
      payload: apiErr as ApexError,
    };
  } else if (apiErr instanceof Error) {
    return {
      type: CATCH_UNEXPECTED_ERROR,
      payload: new FatalError(apiErr),
    };
  } else {
    return {
      type: CATCH_API_ERROR,
      payload: createErrorInfo(
        'APIエラー',
        apiErr.errorCode,
        apiErr.message,
        apiErr.stackTrace || '',
        options.isContinuable
      ),
    };
  }
}

export type ClearErrorAction = {
  type: 'CLEAR_ERROR';
};

export function clearError(): ClearErrorAction {
  return {
    type: CLEAR_ERROR,
  };
}
