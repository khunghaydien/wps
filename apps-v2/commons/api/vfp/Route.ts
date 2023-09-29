import Base from './Base';

export default class Route extends Base {
  remoting: any;

  /**
   * 電車の駅、バス停の名称を取得する
   */
  searchStation(state, param, callback) {
    return this.remoting.searchStation(
      param,
      (result, event) => {
        if (event.status) {
          console.log('Response Payload searchStation:', result);
          callback(result);
        } else {
          // TODO: dispatch Error
        }
      },
      { escape: false, buffer: false }
    );
  }

  /**
   * 電車の駅、バス停の履歴を取得する
   */
  getStationHistory(state, empId, callback) {
    return this.remoting.getStationHistory(
      { empId },
      (result, event) => {
        if (event.status) {
          console.log('Response Payload getStationHistory:', result);
          callback(result);
        } else {
          // TODO: dispatch Error
        }
      },
      { escape: false, buffer: false }
    );
  }

  /**
   * 経路を取得する
   */
  searchRoute(state, param, callback) {
    return this.remoting.searchRoute(
      param,
      (result, event) => {
        if (event.status) {
          console.log('Response Payload searchRoute:', result);
          callback(result);
        } else {
          // TODO: dispatch Error
        }
      },
      { escape: false, buffer: false }
    );
  }
}
