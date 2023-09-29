import Base from './Base';

export default class EmpInfo extends Base {
  /**
   *  社員情報を取得する
   */
  fetchEmpInfo(state, callback) {
    return this.getConnection().then((conn) => {
      conn.apex
        .get(this.encodedURI`/restproxy-pc/getEmpInfo`)
        .then((result) => {
          if (result.error) {
            throw result;
          }
          callback(result);
        })
        .catch((err) => {
          console.error(err);
          // TODO: dispatch Error
        });
    });
  }
}
