import msg from '../languages';

export type ErrorInfo = {
  /**
   * The error code
   */
  errorCode: string;

  /**
   * The stack trace of the error
   */
  stackTrace: string;

  /**
   * The error message
   */
  message: string;

  /**
   * The type of error
   */
  type: string;

  /**
   * The error description along with cause
   */
  problem: string;

  /**
   * Whether the app can continue or not
   */
  isContinuable: boolean;

  isFunctionCantUseError: boolean;
};

export const createErrorInfo = (
  type: string,
  errorCode: string,
  message: string,
  stackTrace: string,
  isContinuable = true
): ErrorInfo => {
  // NOTE
  // Use a message corresponding to errorCode for usability.
  const problem = msg()[errorCode] || message;
  return {
    errorCode,
    stackTrace,
    message: `${type} - ${problem}`,
    type,
    problem,
    isContinuable,
    isFunctionCantUseError: errorCode ? /_CANNOT_USE$/.test(errorCode) : false,
  };
};
