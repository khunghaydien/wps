import Base from './Base';

export default class CurrencyList extends Base {
  /**
   *  通貨一覧を取得する
   */
  fetchCurrencyList(state, callback) {
    return this.getConnection().then((conn) => {
      conn.apex
        .get(this.encodedURI`/restproxy-pc/getCurrencyList`)
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
