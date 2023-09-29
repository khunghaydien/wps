import Base from './Base';

export default class CurrencyList extends Base {
  remoting: any;

  /**
   * 通貨一覧を取得する
   */
  fetchCurrencyList(state, callback) {
    return this.remoting.getCurrencyList(
      (result, event) => {
        if (event.status) {
          console.log('Response Payload getCurrencyList:', result);
          callback(result);
        } else {
          // TODO: dispatch Error
        }
      },
      { escape: false, buffer: false }
    );
  }
}
