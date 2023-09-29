export type ResponseError = Readonly<{
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

  groupCode: 1 | 2;
}>;

export type Failure = Readonly<{
  isSuccess: false;

  /**
   * Info about API error
   */
  error: ResponseError;
}>;

export type Success = Readonly<{
  isSuccess: true;
  result: Record<string, any>;
}>;

export type Response = Failure | Success;
