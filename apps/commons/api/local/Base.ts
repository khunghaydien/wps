import jsforce from 'jsforce';

const REST_API_ENDPOINT_URL = '/restproxy-pc/wsp-dev';

export default class Base {
  connection: any;
  /**
   * URLエンコード変換タグ関数
   */
  encodedURI(strs, ...vars) {
    return strs
      .filter((str, index) => !(str === '' && vars.length < index))
      .reduce((prev, current, index) => {
        return (
          prev + current + (vars[index] ? encodeURIComponent(vars[index]) : '')
        );
      }, '');
  }

  getConnection(): any {
    if (this.connection) {
      return Promise.resolve(this.connection);
    }
    return new Promise((resolve) => {
      jsforce.browser.init({
        clientId:
          '3MVG9ZL0ppGP5UrC6hqPkDR0qRIqmxt0xhy2ESGQoOfI6CW5iiR19i438XsazeZDUctteu5qLyg==',
        redirectUri: 'http://localhost:3000/',
        proxyUrl: 'http://localhost:3123/proxy/',
      });
      jsforce.browser.on('connect', (conn) => {
        this.connection = conn;
        resolve(this.connection);
      });
      if (!jsforce.browser._getTokens()) {
        jsforce.browser.login();
      }
    });
  }

  /**
   * API リクエスト
   * @param {object} req { path, param } から成るオブジェクト
   * TODO: 内部の非同期処理のエラーがすべて catch できるか未検証
   */
  invoke(req) {
    return new Promise((resolve, reject) => {
      this.getConnection().then((conn) => {
        console.log(req.path, ':', req.param);
        // NOTE: 現行アーキテクチャではすべて POST
        conn.apex
          .post(REST_API_ENDPOINT_URL, req)
          .then((result) => {
            console.log('api request finished');
            // FIXME: 実際には、サーバー側で定めたエラーの定義に合わせた判定になる
            if (result.error) {
              reject(result.error);
            }
            resolve(result);
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      });
    });
  }
}
