import jsforce from 'jsforce';

import SALESFORCE_API_VERSION from '../../config/salesforceApiVersion';

let connection;

function getConnection() {
  if (!connection) {
    connection = new jsforce.Connection({
      accessToken: window.sfSessionId,
      version: SALESFORCE_API_VERSION,
    });
  }
  return connection;
}

export default class Base {
  remoting: any;
  constructor(remoting) {
    this.remoting = remoting;
  }

  getRemoting() {
    // @ts-ignore
    // eslint-disable-next-line no-undef, camelcase, @typescript-eslint/naming-convention
    return __SF_NAMESPACE__RemoteApiController;
  }

  /**
   * API リクエスト
   * @param {object} req { path, param } から成るオブジェクト
   */
  invoke(req) {
    return new Promise((resolve, reject) => {
      this.getRemoting().invoke(
        JSON.stringify(req),
        (result, event) => {
          // TODO: サーバー側のエラーハンドリングの仕様が決まったら
          // それに合わせた形でリクエストの正否を判定する。
          if (event.status) {
            resolve(JSON.parse(result));
          } else {
            console.log('Remote Action error occured:', event);
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ message: event.message, where: event.where });
          }
        },
        { escape: false, buffer: false }
      );
    });
  }

  /**
   * SFAPI Request
   * @param {string} reqestPath
   * @param {object} param
   */
  static requestSFApi = (requestPath, param) =>
    new Promise((resolve, reject) => {
      const conn = getConnection();
      conn
        .requestPost(requestPath, param) // TODO: add error logic.
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
}
