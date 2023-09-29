import { Failure } from '../api/Response';

/**
 * Representing error occurred from remote
 */
export default class RemoteError extends Error {
  /**
   * Error code of API Error
   */
  errorCode: string;

  /**
   * Error message of API Error
   */
  message: string;

  /**
   * Stacktrace of API Error
   */
  stackTrace: string;

  /**
   * Error group
   *
   * 1: Operation error
   * 2: System error
   */
  groupCode: 1 | 2;

  /**
   * API path for Sentry Logging
   */
  path: string;

  constructor({ error }: Failure, path?: string) {
    super();

    this.errorCode = error.errorCode;
    this.message = error.message;
    this.stackTrace = error.stackTrace;
    this.stack = error.stackTrace;
    this.groupCode = error.groupCode;
    this.path = path || '';
  }
}
