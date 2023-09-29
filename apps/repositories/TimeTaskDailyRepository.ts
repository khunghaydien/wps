import defaultTo from 'lodash/defaultTo';
import uuid from 'uuid/v4';

import Api from '../commons/api';
import { compose } from '../commons/utils/FnUtil';

import { DailyTask } from '../domain/models/time-tracking/DailyTask';

import adapter from './adapters';

const makeIdentifiable = (items: Array<any>) => {
  return items.map((item) => ({
    ...item,
    id: item.id || uuid(),
  }));
};

const toRemote = (dailyTask: DailyTask, empId?: string) => {
  const estimateVolume = (task: any) => {
    return task.ratio === 0 ? 0 : Math.round(600 * ((task.ratio || 0) / 100));
  };
  return {
    empId: empId || null,
    targetDate: dailyTask.targetDate,
    note: dailyTask.note,
    output: dailyTask.output,
    recordItems: dailyTask.taskList.map((task) => ({
      jobId: task.jobId,
      workCategoryId: task.workCategoryId || null,
      isDirectInput: task.isDirectInput,
      ratio: defaultTo(task.ratio, null),
      taskNote: task.taskNote || null,

      taskTime: defaultTo(task.isDirectInput ? task.taskTime : null, null),
      // NOTE
      // volumeはPC版UIに依存した値のため、他の環境では再現不可能。
      // (volumeは将来削除する予定ではある。)
      // どうしようもないので、妥協案としてvolumeの時間入力の場合にはtaskTimeを入れて(最大600)、
      // 割合入力では600 * (ratio / 100)を入れることとする。
      volume: defaultTo(
        task.isDirectInput
          ? Math.min(task.taskTime || 0, 600)
          : estimateVolume(task),
        null
      ),
    })),
  };
};

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
    empId?: string;
    targetDate: string;
  }): Promise<DailyTask> => {
    const result = await Api.invoke({ path: '/time/task/daily/get', param });
    const entity = adapter.fromRemote<DailyTask>(result);
    return {
      ...entity,
      taskList: compose(makeIdentifiable)(entity.taskList || []),
    };
  },

  /**
   * Exectue to update an entity
   */
  async update<T extends DailyTask>(
    entity: T,
    empId?: string
  ): Promise<Readonly<{ isSuccess: true; result: null }>> {
    return Api.invoke({
      path: '/time/record-item/daily/save',
      param: adapter.toRemote(toRemote(entity, empId)),
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
