import ObjectUtil from '@commons/utils/ObjectUtil';

export default class TaskUtil {
  /**
   * jobIdとworkcategoryIdからtaskIdを生成する
   * @param {Object} task
   */
  static createId(task) {
    const jobId = ObjectUtil.getOrDefault(task, 'jobId', '');
    const workCategoryId = ObjectUtil.getOrDefault(task, 'workCategoryId', '');
    return `${jobId}-${workCategoryId}`;
  }

  static createTaskName(task) {
    const jobName = ObjectUtil.getOrDefault(task, 'jobName', '');
    const workCategoryName = ObjectUtil.getOrDefault(
      task,
      'workCategoryName',
      ''
    );

    if (workCategoryName !== '') {
      return `${jobName} / ${workCategoryName}`;
    } else {
      return `${jobName}`;
    }
  }
}
