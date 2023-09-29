import Base from './Base';

export default class EmpInfo extends Base {
  remoting: any;

  /**
   * 社員に関する基礎情報を取得する
   */
  fetchEmpInfo(state, callback) {
    // Vfp側はInitで取得するため、処理しない
    callback(window.empInfo);
  }
}
