import sumBy from 'lodash/sumBy';

import Api from '../commons/api';

import { DailyRecord } from '../domain/models/time-tracking/DailyRecord';
import { DailyRecordItem } from '../domain/models/time-tracking/DailyRecordItem';

import adapter from './adapters';

export default {
  /**
   * Execute search for entity with a given query
   */
  search: async (param: {
    empId?: string;
    startDate: string;
    endDate: string;
  }): Promise<DailyRecord[]> => {
    const { dailyRecordList } = await Api.invoke({
      path: '/time-track/record/actual/get',
      param,
    });
    return dailyRecordList.map((record) => ({
      ...adapter.fromRemote<DailyRecord>(record),
      targetDate: record.recordDate,
      dailyRecordItemList: record.dailyRecordItemList.map((item) =>
        adapter.fromRemote(item)
      ),
      time:
        record.dailyRecordItemList && record.dailyRecordItemList.length > 0
          ? sumBy(
              record.dailyRecordItemList as DailyRecordItem[],
              (item) => item.taskTime
            )
          : null,
    }));
  },

  /**
   * Execute to get an entity
   */

  /*
  fetch: async (param: {|
  |}): Promise<{}> => {
  },
    */

  /**
   * Execute to update an entity
   */

  /*
  update: async (
  ): Promise<{}> => {
  },
    */

  /**
   * Execute to create a new entity
   */

  /*
  create: (entity: {||}): Promise<void> => {},
  */

  /**
   * Execute to delete an employee
   */

  /*
  delete: (id: string): Promise<void> => {
  },
  */
};
