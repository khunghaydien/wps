import Base from './Base';

export default class ExpTypeList extends Base {
  remoting: any;
  /**
   * 費目と費目グループを取得する
   */
  fetchExpTypeAndGroupList(state, parentId, currencyType, callback) {
    return this.remoting.getExpTypeAndGroupList(
      { parentId, currencyType },
      (result, event) => {
        if (event.status) {
          console.log('Response Payload fetchExpTypeAndGroupList:', result);
          callback(result);
        } else {
          // TODO: dispatch Error
        }
      },
      { escape: false, buffer: false }
    );
  }
}
