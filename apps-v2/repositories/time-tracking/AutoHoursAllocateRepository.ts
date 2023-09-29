import moment from 'moment';
import nanoid from 'nanoid';

import Api from '@apps/commons/api';

import { Alert } from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import {
  AutoHoursAllocationResult,
  MATCHING_TYPE,
  MatchingType,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

type AutoHoursAllocationResultFromRemote = {
  allocateResult: MatchingType;
  eventTitle: string;
  startTime: string;
  endTime: string;
  jobId: string | null;
  jobCode: string | null;
  jobName: string | null;
  hasJobType: boolean | null;
  workCategoryId: string | null;
  workCategoryCode: string | null;
  workCategoryName: string | null;
  calculatedTaskTime: number;
  dictItemKey: string;
};

const convertAutoHoursAllocationResult = (
  resultFromRemote: AutoHoursAllocationResultFromRemote
): AutoHoursAllocationResult => {
  return {
    eventId: nanoid(8),
    import: resultFromRemote.allocateResult === MATCHING_TYPE.MATCHED,
    allocateResult: resultFromRemote.allocateResult,
    eventTitle: resultFromRemote.eventTitle,
    startTime: moment(resultFromRemote.startTime).format('HH:mm'),
    endTime: moment(resultFromRemote.endTime).format('HH:mm'),
    job: resultFromRemote.jobId
      ? {
          id: resultFromRemote.jobId,
          code: resultFromRemote.jobCode,
          name: resultFromRemote.jobName,
          hasJobType: resultFromRemote.hasJobType,
        }
      : null,
    workCategory: resultFromRemote.workCategoryId
      ? {
          id: resultFromRemote.workCategoryId,
          code: resultFromRemote.workCategoryCode,
          name: resultFromRemote.workCategoryName,
        }
      : null,
    taskTime: resultFromRemote.calculatedTaskTime,
    dictItemId: resultFromRemote.dictItemKey,
    isModified: false,
    differFromDictionary:
      resultFromRemote.allocateResult === MATCHING_TYPE.UNMATCHED,
  };
};

export default {
  fetchAll: async (
    empId: string | undefined,
    targetDate: string
  ): Promise<[AutoHoursAllocationResult[], Alert[] | null]> => {
    const [resultsFromRemote, alerts]: [
      AutoHoursAllocationResultFromRemote[],
      Alert[] | null
    ] = await Api.invoke({
      path: '/time/auto-hours-allocation/result/get',
      param: { empId, targetDate },
    }).then((result) => [result.allocateResultList, result.alerts]);

    return [resultsFromRemote.map(convertAutoHoursAllocationResult), alerts];
  },
};
