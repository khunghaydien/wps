import Base from './Base';

export default class Route extends Base {
  /**
   * 電車の駅、バス停の名称を取得する
   */
  searchStation(state, param, callback) {
    return this.getConnection().then((conn) => {
      conn.apex
        .post('/restproxy-pc/searchStation', param)
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

  /**
   * 電車の駅、バス停の履歴を取得する
   */
  getStationHistory(state, empId, callback) {
    return this.getConnection().then((conn) => {
      conn.apex
        .get(
          this.encodedURI`/restproxy-pc/getStationHistoryByEmpId?empId=${empId}`
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

  /**
   * 経路を取得する
   */
  searchRoute(state, param, callback) {
    return this.getConnection().then((conn) => {
      conn.apex
        .post('/restproxy-pc/searchRoute', param)
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
