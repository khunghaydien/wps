import Api from '..';

export default class JobList {
  /**
   *  ジョブを取得する
   */
  fetchJobListByParent(state, param, callback) {
    const { targetDate, parentId } = param;

    const req = {
      path: '/time/job/get',
      param: {
        targetDate,
        parentId,
      },
    };

    return Api.invoke(req).then((res) => {
      callback(res);
    });
  }
}
