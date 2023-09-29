import Api from '..';

export default class WorkCategoryList {
  /**
   * 作業分類を取得
   * @param {Strng} jobId
   * @param {String} dateStr - UTC
   * @param {Function} callback
   */
  fetchWorkCategoryList(jobId, targetDate, callback) {
    const req = {
      path: '/time/work-category/get',
      param: {
        jobId,
        targetDate,
      },
    };

    return Api.invoke(req).then((res) => {
      callback(res);
    });
  }
}
