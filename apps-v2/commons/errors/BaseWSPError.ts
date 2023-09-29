export default class BaseWSPError extends Error {
  /**
   * @param {String} type
   * @param {String} problem
   * @param {?String} [solution]
   * @param {Object} [options]
   * @param {Boolean} [options.isContinuable]
   * @param {Boolean} [isFunctionCantUseError]
   */
  problem: string;
  solution: string;
  isContinuable: boolean;
  isFunctionCantUseError: boolean;
  type: string;
  options: Record<string, any>;
  constructor(type, problem, solution, options = {}, isFunctionCantUseError) {
    super(`${type} - ${problem}`);

    /** @type {String} エラーのタイプ：ダイアログのヘッダーに表示される */
    this.type = type;

    /** @type {String} （原因＋）起こった問題：e.g.「〜〜のため、〜〜できませんでした」 */
    this.problem = problem;

    /** @type {?String} 回復方法：e.g.「〜〜してください」 */
    this.solution = solution;

    /** @type {Boolean} 操作継続の可否 */
    this.isContinuable =
      typeof (options as any).isContinuable !== 'undefined'
        ? (options as any).isContinuable
        : true;

    this.isFunctionCantUseError = isFunctionCantUseError;
  }
}
