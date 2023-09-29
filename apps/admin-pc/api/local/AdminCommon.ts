import Base from '../../../commons/api/local/Base';

export default class AdminCommon extends Base {
  apiConnector(state, param) {
    return new Promise((resolve, reject) => {
      return this.getConnection().then((conn) => {
        conn.apex
          .post('/restproxy-pc/wsp-dev', param)
          .then((result) => {
            if (result.error) {
              // TODO rejectをどうするか検討
              reject(result.error);
            }
            resolve(result);
          })
          .catch((err) => {
            console.error(err);
            // TODO: エラー画面に置き換える
            reject(err);
            // TODO: dispatch Error
          });
      });
    });
  }
}
