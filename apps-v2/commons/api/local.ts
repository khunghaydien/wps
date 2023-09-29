import FileReaderStream from 'filereader-stream';
import jsforce from 'jsforce';

import SALESFORCE_API_VERSION from '../config/salesforceApiVersion';

const REST_API_ENDPOINT_URL = '/restproxy-pc/wsp-dev';

let connection;

function getConnection(): any {
  if (connection) {
    return Promise.resolve(connection);
  }

  const clientConfig = {
    clientId:
      '3MVG9ZL0ppGP5UrC6hqPkDR0qRIqmxt0xhy2ESGQoOfI6CW5iiR19i438XsazeZDUctteu5qLyg==',
    redirectUri: 'http://localhost:3000/',
    proxyUrl: 'http://localhost:3123/proxy/',
    loginUrl: process.env.LOGIN_URL
      ? process.env.LOGIN_URL
      : 'https://login.salesforce.com',
  };

  // specify sf username + password_token in .env file to login
  // here, username is login email, password_token is direct concatenation of password and security token
  if (process.env.USERNAME && process.env.PASSWORD_TOKEN) {
    return new Promise((resolve) => {
      connection = new jsforce.Connection(clientConfig);
      connection.login(process.env.USERNAME, process.env.PASSWORD_TOKEN, () => {
        resolve(connection);
      });
    });
  }

  return new Promise((resolve) => {
    jsforce.browser.init(clientConfig);
    jsforce.browser.on('connect', (conn) => {
      connection = conn;
      resolve(connection);
    });
    if (!jsforce.browser._getTokens()) {
      jsforce.browser.login();
    }
  });
}

export default class ApiForLocal {
  /**
   * API リクエスト
   * @param {object} req { path, param } から成るオブジェクト
   * TODO: 内部の非同期処理のエラーがすべて catch できるか未検証
   */
  static invoke(req: { path: string; param: Record<string, any> }) {
    console.log('API接続環境: local');
    return new Promise((resolve, reject) => {
      getConnection().then((conn) => {
        console.log(req.path, ':', req.param);

        // NOTE: 現行アーキテクチャではすべて POST
        conn.apex
          .post(REST_API_ENDPOINT_URL, req)
          .then((response) => {
            console.log('api request finished');

            if (response.isSuccess) {
              resolve(response.result);
            } else {
              reject(response.error);
            }
          })
          .catch((err) => {
            // TODO: apex.postで発生しうるエラーを確認して、エラーの表現の方針を検討する
            console.error(err);
            reject(err);
          });
      });
    }) as Promise<Record<string, any>[] | Record<string, any>>;
  }

  /**
   * Call SFApi
   * @param {string} reqestPath
   * @param {object} param
   */
  static requestSFApi = (requestPath: string, param: Record<string, any>) =>
    new Promise((resolve, reject) => {
      getConnection().then((conn) => {
        conn
          .requestPost(requestPath, param)
          .then((response) => resolve(response))
          .catch((err) => reject(err));
      });
    }) as Promise<Record<string, any>>;

  /**
   * SFAPI Get Request
   * @param {string} requestPath
   * @param {object} param
   */
  static requestSFGetApi = (
    requestPath: string,
    options: Record<string, any>
  ) =>
    new Promise((resolve, reject) => {
      getConnection().then((conn) => {
        conn
          .requestGet(requestPath, options)
          .then((response) => resolve(response))
          .catch((err) => reject(err));
      });
    }) as Promise<Record<string, any>>;

  /**
   * List Metadata
   *
   * TODO:
   * DO NOT LINK this code to PRODUCTION
   */
  static listMetadata(
    types: Array<{ type: string; folder?: string }>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      getConnection().then((conn) => {
        conn.metadata.list(types, SALESFORCE_API_VERSION, (err, metadata) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(metadata);
          }
        });
      });
    });
  }

  /**
   * Read Metadata
   *
   * TODO:
   * DO NOT LINK this code to PRODUCTION
   */
  static readMetadata(type: string, fullNames: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      getConnection().then((conn) => {
        conn.metadata.read(type, fullNames, (err, metadata) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(metadata);
          }
        });
      });
    });
  }

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
      getConnection().then((conn) => {
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
    });
  }
}
