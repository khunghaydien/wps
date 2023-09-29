import FileReaderStream from 'filereader-stream';
import jsforce from 'jsforce';

import SALESFORCE_API_VERSION from '../config/salesforceApiVersion';
import ApexError, { ApexEvent } from '../errors/ApexError';
import RemoteError from '../errors/RemoteError';
import { Failure, Response } from './Response';

type RemotingCallback = (response: string, event: { status: any }) => void;
type InvokeOption = {
  escape?: boolean;
  buffer?: boolean;
  timeout?: number;
};
type Invoke = (
  body: string,
  callback: RemotingCallback,
  option: InvokeOption
) => void;

// eslint-disable-next-line camelcase, @typescript-eslint/naming-convention
declare let __SF_NAMESPACE__RemoteApiController: { invoke: Invoke };

function getRemoting() {
  // eslint-disable-next-line no-undef, camelcase, @typescript-eslint/naming-convention
  return __SF_NAMESPACE__RemoteApiController;
}

let connection;

function getConnection() {
  if (!connection) {
    connection = new jsforce.Connection({
      sessionId: window.sfSessionId,
      version: SALESFORCE_API_VERSION,
      serverUrl: window.sfServerUrl,
    });
  }
  return connection;
}

export default class ApiForVfp {
  /**
   * API リクエスト
   * @param {object} req { path, param } から成るオブジェクト
   */
  static invoke(req: {
    path: string;
    param: Record<string, any>;
  }): Promise<Record<string, any>> {
    console.log('API接続環境: vfp');
    return new Promise(
      (resolve, reject: (error: RemoteError | ApexError) => void) => {
        getRemoting().invoke(
          JSON.stringify(req),
          (responseStr, event) => {
            if (event.status) {
              // RemoteAction成功
              // レスポンスはJSON形式のString型で返ってくるので、必ずparseする
              const response: Response = JSON.parse(responseStr);

              // 実行結果でPromiseをresolve/rejectする
              if (response.isSuccess) {
                resolve(response.result);
              } else {
                reject(new RemoteError(response as Failure, req.path));
              }
            } else {
              console.error(
                (event as ApexEvent).message,
                (event as ApexEvent).where
              );
              reject(new ApexError(event as ApexEvent));
            }
          },
          { escape: false, buffer: false, timeout: 120000 }
        );
      }
    );
  }

  /**
   * SFAPI Request
   * @param {string} requestPath
   * @param {object} param
   */
  static requestSFApi = (
    requestPath: string,
    param: Record<string, any>
  ): Promise<Record<string, any>> =>
    new Promise((resolve, reject) => {
      const conn = getConnection();
      conn
        .requestPost(requestPath, param) // TODO: add error logic.
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });

  /**
   * SFAPI Get Request
   * @param {string} requestPath
   * @param {object} param
   */
  static requestSFGetApi = (
    requestPath: string,
    options: Record<string, any>
  ): Promise<Record<string, any>> =>
    new Promise((resolve, reject) => {
      const conn = getConnection();
      conn
        .requestGet(requestPath, options)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });

  /**
   * Using the SF bulk API to directly access the database
   *
   * @param sobjectType
   * @param operation
   * @param file
   * @param projectId
   */
  static async bulkApi(
    sobjectType: string,
    operation: string,
    file: File
  ): Promise<any> {
    const csvInputStream = new FileReaderStream(file);

    return new Promise((resolve, reject) => {
      const conn = getConnection();
      conn.bulk.pollTimeout = 60000;
      conn.bulk.load(
        sobjectType,
        operation,
        csvInputStream,
        function (err, response) {
          if (err) {
            return reject(err);
          } else {
            return resolve(response);
          }
        }
      );
    });
  }
}
