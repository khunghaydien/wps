import { createSelector } from 'reselect';
import { $Shape } from 'utility-types';

import {
  catchApiError as $catchApiError,
  CatchApiErrorAction,
  catchBusinessError as $catchBusinessError,
  CatchBusinessErrorAction,
  CatchUnexpectedErrorAction,
} from '../../../commons/actions/app';
import { ErrorInfo } from '../../../commons/errors/ErrorInfo';
import ApexError from '@apps/commons/errors/ApexError';
import FatalError from '@apps/commons/errors/FatalError';

// State

type State = $Shape<{
  isContinuable: boolean;
  errorCode: string;
  problem: string;
  message: string;
  stackTrace: string;
}>;

const initialState: State = {};

// Selector

export const errorExists = createSelector(
  (state: State) => state,
  (state: State): boolean => {
    // Test object is empty or not.
    return !(Object.keys(state).length === 0 && state.constructor === Object);
  }
);

// Actions

type ResetError = {
  type: 'RESET_ERROR';
};

/**
 * Reset state
 */
export const reset = () => ({
  type: 'RESET_ERROR',
});

/**
 * Dispatch error handling action (API)
 */
export const catchApiError = $catchApiError;

/**
 * Dispatch error handling action (Business)
 */
export const catchBusinessError = $catchBusinessError;

type Action =
  | ResetError
  | CatchApiErrorAction
  | CatchBusinessErrorAction
  | CatchUnexpectedErrorAction;

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'RESET_ERROR': {
      return {};
    }

    case 'CATCH_API_ERROR': {
      const error = action.payload as ErrorInfo;
      return {
        isContinuable: error.isContinuable,
        errorCode: error.errorCode,
        message: error.problem,
        stackTrace: error.stackTrace,
      };
    }

    case 'CATCH_BUSINESS_ERROR': {
      const error = action.payload as unknown as ErrorInfo;
      return {
        isContinuable: error.isContinuable,
        errorCode: error.errorCode,
        message: error.problem,
        stackTrace: error.stackTrace,
      };
    }

    case 'CATCH_UNEXPECTED_ERROR': {
      const error = action.payload;
      if (error instanceof ApexError) {
        return {
          isContinuable: false,
          errorCode: '',
          message: error.message,
          stackTrace: '',
        };
      } else if (error instanceof FatalError) {
        return {
          isContinuable: false,
          errorCode: '',
          message: error.message,
          stackTrace: error.stacktrace,
        };
      }
      return {
        isContinuable: false,
        errorCode: '',
        message: (error as Error).message,
        stackTrace: '',
      };
    }

    default: {
      return state;
    }
  }
};
