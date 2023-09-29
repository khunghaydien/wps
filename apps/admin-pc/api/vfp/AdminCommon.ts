import Base from '../../../commons/api/vfp/Base';

export default class AdminCommon extends Base {
  apiConnector(state, param) {
    return new Promise((resolve, reject) => {
      return this.getRemoting().invoke(
        JSON.stringify(param),
        (result, event) => {
          const resultJson = JSON.parse(result);
          if (event.status) {
            console.log('Response Payload connection:', resultJson);
            // TODO: rejectするか検討
            if (resultJson.error) {
              reject(resultJson.error);
            }
            resolve(resultJson);
          } else {
            // TODO: dispatch Error
            console.log(resultJson);
            reject(resultJson);
          }
        },
        { escape: false, buffer: false }
      );
    });
  }
}
