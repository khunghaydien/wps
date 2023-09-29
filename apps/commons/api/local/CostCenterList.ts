import Base from './Base';

export default class CostCenterList extends Base {
  /**
   *  コストセンターを取得する
   */
  fetchCostCenterListByParent(state, parentId, callback) {
    return this.getConnection().then((conn) => {
      conn.apex
        .get(
          this.encodedURI`/restproxy-pc/getCostCenterList?parentId=${parentId}`
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
