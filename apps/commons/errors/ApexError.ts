export type ApexEvent = {
  action: string;
  data: Array<{
    path: string;
    param: Record<string, any>;
  }>;
  message: string;
  method: string;
  ref: boolean;
  statusCode: number;
  tid: number;
  type: string;
  vfDbg: boolean;
  vfTx: boolean;
  where: string;
  status?: number; // added extra to fix test case, should remove it
};

/**
 * システムが継続利用できない致命的なAPEXエラーを表現します。
 * NOTE: ApexErrorはデプロイ環境(VFP)のみ発生しえます。
 */
export default class ApexError extends Error {
  /**
   * type
   */
  type: 'ApexError';

  /**
   * Http Status Code
   */
  statusCode: number;

  /**
   * action
   * APIは全てRemoteApiControllerを継承してるので、基本的にRemoteApiControllerになります。
   */
  action: string;

  /**
   * エラーメッセージ
   */
  message: string;

  /**
   * リクエストパスとパラメーターのリスト
   */
  data: Array<{
    path: string;
    param: Record<string, any>;
  }>;

  /**
   * エラーの発生場所
   */
  where: string;

  /**
   * @param event ApexEvent
   */
  constructor(event: ApexEvent) {
    super();

    const { statusCode, data, action, message, where } = event;
    this.type = 'ApexError';
    this.statusCode = statusCode;
    this.data = data;
    this.action = action;
    this.message = message;
    this.where = where;
  }
}
