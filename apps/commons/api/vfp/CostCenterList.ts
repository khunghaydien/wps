import Base from './Base';

export default class CostCenterList extends Base {
  remoting: any;

  /**
   * コストセンターを取得する
   */
  fetchCostCenterListByParent(state, parentId, callback) {
    return this.remoting.getCostCenterList(
      { parentId },
      (result, event) => {
        if (event.status) {
          console.log('Response Payload fetchCostCenterListByParent:', result);
          callback(result);
        } else {
          // TODO: dispatch Error
        }
      },
      { escape: false, buffer: false }
    );
  }
}
