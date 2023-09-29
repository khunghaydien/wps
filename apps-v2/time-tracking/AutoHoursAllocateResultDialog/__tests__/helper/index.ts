import {
  AutoHoursAllocationResult,
  MATCHING_TYPE,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';
import { Job, JobPickListItem } from '@apps/domain/models/time-tracking/Job';
import { WorkCategory } from '@apps/domain/models/time-tracking/WorkCategory';

let idCounter = 0;
export const uniq = (): string => (++idCounter).toString(10).padStart(3, '0');
uniq.reset = () => {
  idCounter = 0;
};

export const job = (
  id: string = uniq()
): Pick<Job, 'id' | 'code' | 'name' | 'hasJobType'> => ({
  id: `JOB_ID_${id}`,
  code: `JOB_CODE_${id}`,
  name: `JOB_NAME_${id}`,
  hasJobType: true,
});

export const jobPickListItem = (id: string = uniq()): JobPickListItem => ({
  jobId: `JOB_ID_${id}`,
  jobCode: `JOB_CODE_${id}`,
  jobName: `JOB_NAME_${id}`,
  hasJobType: true,
});

export const workCategory = (id: string = uniq()): WorkCategory => ({
  id: `WORK_CATEGORY_ID_${id}`,
  code: `WORK_CATEGORY_CODE_${id}`,
  name: `WORK_CATEGORY_NAME_${id}`,
});
workCategory.long = (
  id: string = uniq()
): {
  workCategoryId: string;
  workCategoryCode: string;
  workCategoryName: string;
} => ({
  workCategoryId: `WORK_CATEGORY_ID_${id}`,
  workCategoryCode: `WORK_CATEGORY_CODE_${id}`,
  workCategoryName: `WORK_CATEGORY_NAME_${id}`,
});

export const autoHoursAllocationResult = (
  id: string = uniq()
): AutoHoursAllocationResult => ({
  eventId: `EVENT_ID_${id}`,
  import: true,
  allocateResult: MATCHING_TYPE.MATCHED,
  eventTitle: `EVENT_TITLE_${id}`,
  startTime: '2022-03-18T11:00:00.000Z',
  endTime: '2022-03-18T12:00:00.000Z',
  job: job(),
  workCategory: workCategory(),
  taskTime: 60,
  dictItemId: `DICT_ITEM_KEY_${id}`,
  isModified: false,
  differFromDictionary: true,
});
