/**
 * システムが継続利用できない致命的なエラーを表現します。
 */
export default class FatalError {
  /**
   * type
   */
  type: 'FatalError';

  /**
   * エラーコード
   */
  errorCode?: string;

  /**
   * エラー名
   */
  name: string;

  /**
   * エラーメッセージ
   */
  message: string;

  /**
   * スタックトレース
   */
  stacktrace: string;

  /**
   * @param error 例外オブジェクト
   */
  constructor(error: { errorCode?: string } & Error) {
    const { errorCode, name, message, stack } = error;
    this.type = 'FatalError';
    this.errorCode = errorCode;
    this.name = name;
    this.message = message;
    this.stacktrace = stack;
  }
}
