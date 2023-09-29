import Base from './Base';

export default class ExpTypeList extends Base {
  /**
   * 費目と費目グループを取得する
   */
  fetchExpTypeAndGroupList(state, parentId, currencyType, callback) {
    const currencyTypeParam = currencyType || '';
    return this.getConnection().then((conn) => {
      conn.apex
        .get(
          this
            .encodedURI`/restproxy-pc/getExpTypeAndGroupList?parentId=${parentId}&currencyType=${currencyTypeParam}`
        )
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
