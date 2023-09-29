import Api from '../commons/api';

import {
  convertFromRemote,
  DailySummary,
  DailySummaryParam,
} from '../domain/models/time-management/DailySummary';

export default {
  /**
   * Execture search for entity with a given query
   */

  /*
  search: (query: *): Promise<*[]> => {
  },
  */

  /**
   * Exectue to get an entity
   */
  fetch: async (param: {
    targetDate: string;
    empId?: string;
  }): Promise<DailySummary> => {
    const response = await Api.invoke({
      path: '/daily-summary/get',
      param: {
        targetDate: param.targetDate,
        empId: param.empId,
      },
    });
    return convertFromRemote(response);
  },

  /**
   * Exectue to update an entity
   */
  update: async (
    { targetDate, note, output, taskList }: DailySummary,
    empId?: string
  ): Promise<Readonly<{ isSuccess: true; result: null }>> => {
    const param: DailySummaryParam = {
      empId,
      targetDate,
      note: note || undefined,
      output: output || undefined,
      taskList: taskList.map(
        ({
          jobId,
          workCategoryId,
          isDirectInput,
          taskTime,
          ratio,
          taskNote,
        }) => ({
          jobId,
          workCategoryId: workCategoryId || null, // null for empty string,
          isDirectInput,
          taskTime: isDirectInput ? taskTime || 0 : undefined,
          ratio: isDirectInput ? undefined : ratio || 0,
          taskNote: taskNote || '',
        })
      ),
    };
    return Api.invoke({
      path: '/daily-summary/save',
      param,
    });
  },
  /**
   * Exectue to create a new entity
   */

  /*
  create: (entity: {||}): Promise<void> => {},
  */

  /**
   * Exectue to delete an employee
   */

  /*
  delete: (id: string): Promise<void> => {
  },
  */
};
