import Api from '../../commons/api';

import defaultRequest from '../../domain/models/time-tracking/Request';
import {
  Summary,
  SummaryFromRemoteWithRequest,
} from '../../domain/models/time-tracking/Summary';

import adapter from '../adapters';

export type DateResult = {
  reason:
    | 'INVALID_JOB_IN_TIME_TRACKING'
    | 'INVALID_TERM_IN_JOB'
    | 'INVALID_TERM_IN_JOB_ASSIGN'
    | 'INVALID_TERM_IN_WORK_CATEGORY'
    | 'NOT_LINKED_WORK_CATEGORY'
    | 'NOT_FOUND_TIME_RECORD_ITEM'
    | 'SUCCESS';
  targetDate: string;
};

type SummaryTaskUpdateResult = {
  isSuccess: boolean;
  dateList: ReadonlyArray<DateResult>;
};

const toSummaryModel = (entity: SummaryFromRemoteWithRequest): Summary => {
  const request = entity.request || defaultRequest;
  return {
    request,
    useRequest: entity.useRequest,
    ...entity.summary,
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
  fetchSummary: async (param: {
    empId?: string;
    targetDate: string;
  }): Promise<Summary> => {
    const result = await Api.invoke({
      path: '/time-track/summary/get',
      param,
    });
    const entity = adapter.fromRemote<SummaryFromRemoteWithRequest>(result);
    return toSummaryModel(entity);
  },

  /**
   * Exectue to update an entity
   */

  /*
  update: (entity: *): Promise<void> => {
  },
  */

  /**
   * Exectue to update an task of summary
   */

  updateSummaryTask: async (param: {
    summaryId: string;
    empId?: string;
    startDate: string;
    endDate: string;
    sourceJobId: string;
    sourceWorkCategoryId?: string;
    destinationJobId: string;
    destinationWorkCategoryId?: string;
  }): Promise<SummaryTaskUpdateResult> => {
    const result = await Api.invoke({
      path: '/time-track/summary-task/update',
      param,
    });
    const entity = adapter.fromRemote<SummaryTaskUpdateResult>(result);
    return entity;
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
