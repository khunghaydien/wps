import {
  AutoHoursAllocationDictItem,
  BasicSetting,
  EXCEED_ACT_WORK_HOURS_TYPE,
  FIELD_TYPE,
  OPERATOR_TYPE,
  OVER_LAPPING_TYPE,
  REFERENCE_SCOPE_TYPE,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import {
  AutoHoursAllocationResult,
  MATCHING_TYPE,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';
import { Job, JobPickListItem } from '@apps/domain/models/time-tracking/Job';

let idCounter = 0;
export const uniq = (): string => (++idCounter).toString(10).padStart(3, '0');
uniq.reset = () => {
  idCounter = 0;
};

let priorityCounter = 0;
export const priority = (): number => ++priorityCounter;
priority.reset = () => {
  priorityCounter = 0;
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

export const workCategory = (id: string = uniq()) => ({
  workCategoryId: `WORK_CATEGORY_ID_${id}`,
  workCategoryCode: `WORK_CATEGORY_CODE_${id}`,
  workCategoryName: `WORK_CATEGORY_NAME_${id}`,
});
workCategory.short = (id: string = uniq()) => ({
  id: `WORK_CATEGORY_ID_${id}`,
  code: `WORK_CATEGORY_CODE_${id}`,
  name: `WORK_CATEGORY_NAME_${id}`,
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
  workCategory: workCategory.short(),
  taskTime: 60,
  dictItemId: `DICT_ITEM_KEY_${id}`,
  isModified: false,
  differFromDictionary: true,
});

export const autoHoursAllocationDictItem = (
  id: string = uniq()
): AutoHoursAllocationDictItem => ({
  key: `DICT_ITEM_ID_${id}`,
  internalUniqKey: `DICT_ITEM_INTERNAL_UNIQ_KEY_${id}`,
  fieldType: FIELD_TYPE.TITLE,
  operatorType: OPERATOR_TYPE.START_WITH,
  valueText: 'MTG',
  job: job(),
  workCategory: workCategory(),
  referenceScopeType: REFERENCE_SCOPE_TYPE.INDIVIDUAL,
  priority: priority(),
});

export const basicSetting = (): BasicSetting => ({
  surplusTimeRegistrationJob: job(),
  surplusTimeRegistrationWorkCategory: workCategory(),
  allocateMethodForOverlappingEvent: OVER_LAPPING_TYPE.TO_ALL,
  allocateMethodForExceedActWorkHour: EXCEED_ACT_WORK_HOURS_TYPE.NONE,
});
