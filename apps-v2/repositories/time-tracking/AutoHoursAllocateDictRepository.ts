import Api from '@apps/commons/api';

import {
  AutoHoursAllocationDictItem,
  AutoHoursAllocationDictSurplusTime,
  BasicSetting,
  EXCEED_ACT_WORK_HOURS_TYPE,
  ExceededActWorkHours,
  FieldType,
  OperatorType,
  OVER_LAPPING_TYPE,
  OverlappingEvent,
  ReferenceScopeType,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';

type DicItemFromRemote = {
  internalUniqKey: string;
  eventCondition: {
    fieldType: FieldType;
    operatorType: OperatorType;
    valueText: string;
  };
  referenceScopeType: ReferenceScopeType;
  priority: number;
  jobId: string;
  jobCode: string;
  jobName: string;
  // NOTE: hasJobTypeはレスポンスには含まれない：日付に依存しない機能であり、履歴情報を正しく取り扱えないため
  workCategoryId: string | null;
  workCategoryCode: string | null;
  workCategoryName: string | null;
};

type AutoHoursAllocationDictFromRemote = {
  surplusTimeRegistrationJobId: string | null;
  surplusTimeRegistrationJobCode: string | null;
  surplusTimeRegistrationJobName: string | null;
  surplusTimeRegistrationWorkCategoryId: string | null;
  surplusTimeRegistrationWorkCategoryCode: string | null;
  surplusTimeRegistrationWorkCategoryName: string | null;
  allocateMethodForOverlappingEvent: OverlappingEvent | null;
  allocateMethodForExceedActWorkHour: ExceededActWorkHours | null;
  dictItems: DicItemFromRemote[];
};

type DictItemToRemote = {
  internalUniqKey: string;
  eventCondition: {
    fieldType?: FieldType;
    operatorType?: OperatorType;
    valueText: string;
  };
  referenceScopeType?: ReferenceScopeType;
  priority: number;
  jobId: string;
  workCategoryId?: string;
};

type AutoHoursAllocationDictToRemote = {
  surplusTimeRegistrationJobId: string;
  surplusTimeRegistrationWorkCategoryId: string;
  allocateMethodForOverlappingEvent: string;
  allocateMethodForExceedActWorkHour: string;
  dictItems: DictItemToRemote[];
};

const convertFromRemote = (
  dictFromRemote: AutoHoursAllocationDictFromRemote
): {
  basicSetting: BasicSetting;
  dictList: AutoHoursAllocationDictItem[] | null;
} => {
  return {
    basicSetting: {
      surplusTimeRegistrationJob: dictFromRemote.surplusTimeRegistrationJobId
        ? {
            id: dictFromRemote.surplusTimeRegistrationJobId,
            code: dictFromRemote.surplusTimeRegistrationJobCode,
            name: dictFromRemote.surplusTimeRegistrationJobName,
            hasJobType: true, // NOTE： 初期表示では必ず作業分類プルダウンを表示する
          }
        : null,
      surplusTimeRegistrationWorkCategory:
        dictFromRemote.surplusTimeRegistrationWorkCategoryId
          ? {
              workCategoryId:
                dictFromRemote.surplusTimeRegistrationWorkCategoryId,
              workCategoryCode:
                dictFromRemote.surplusTimeRegistrationWorkCategoryCode,
              workCategoryName:
                dictFromRemote.surplusTimeRegistrationWorkCategoryName,
            }
          : null,
      allocateMethodForOverlappingEvent:
        dictFromRemote.allocateMethodForOverlappingEvent ||
        OVER_LAPPING_TYPE.TO_ALL,
      allocateMethodForExceedActWorkHour:
        dictFromRemote.allocateMethodForExceedActWorkHour ||
        EXCEED_ACT_WORK_HOURS_TYPE.NONE,
    },
    dictList: dictFromRemote.dictItems
      ? dictFromRemote.dictItems.map((item) => {
          return {
            key: item.internalUniqKey,
            internalUniqKey: item.internalUniqKey,
            fieldType: item.eventCondition.fieldType,
            operatorType: item.eventCondition.operatorType,
            valueText: item.eventCondition.valueText,
            job: item.jobId
              ? {
                  id: item.jobId,
                  code: item.jobCode,
                  name: item.jobName,
                  hasJobType: true, // NOTE： 初期表示では必ず作業分類プルダウンを表示する
                }
              : null,
            workCategory: item.workCategoryId
              ? {
                  workCategoryId: item.workCategoryId,
                  workCategoryCode: item.workCategoryCode,
                  workCategoryName: item.workCategoryName,
                }
              : null,
            referenceScopeType: item.referenceScopeType,
            priority: item.priority,
          };
        })
      : null,
  };
};

const buildToRemote = (
  dictList: AutoHoursAllocationDictItem[],
  basicSetting: BasicSetting
): AutoHoursAllocationDictToRemote => {
  return {
    surplusTimeRegistrationJobId: basicSetting.surplusTimeRegistrationJob?.id,
    surplusTimeRegistrationWorkCategoryId:
      basicSetting.surplusTimeRegistrationWorkCategory?.workCategoryId,
    allocateMethodForOverlappingEvent:
      basicSetting.allocateMethodForOverlappingEvent,
    allocateMethodForExceedActWorkHour:
      basicSetting.allocateMethodForExceedActWorkHour,
    dictItems: dictList.map((item) => {
      return {
        internalUniqKey: item.internalUniqKey,
        eventCondition: {
          fieldType: item.fieldType,
          operatorType: item.operatorType,
          valueText: item.valueText,
        },
        referenceScopeType: item.referenceScopeType,
        priority: item.priority,
        jobId: item.job?.id,
        workCategoryId: item.workCategory?.workCategoryId,
      };
    }),
  };
};

export default {
  /**
   * https://teamspiritdev.atlassian.net/l/c/KcRBy4Ho
   */
  fetchAll: (
    empId: string | undefined,
    targetDate: string | undefined
  ): Promise<{
    basicSetting: BasicSetting;
    dictList: AutoHoursAllocationDictItem[] | null;
  }> =>
    Api.invoke({
      path: '/time/auto-hours-allocation-dict/get',
      param: { empId, targetDate },
    }).then(convertFromRemote),

  /**
   * https://teamspiritdev.atlassian.net/l/c/1s3pcA1z
   */
  save: (
    empId: string | undefined,
    dictList: AutoHoursAllocationDictItem[],
    basicSetting: BasicSetting
  ): Promise<void> => {
    const toRemote = buildToRemote(Object.values(dictList), basicSetting);
    return Api.invoke({
      path: '/time/auto-hours-allocation-dict/save',
      param: {
        empId,
        ...toRemote,
      },
    });
  },
  fetchSurplusTime: (
    empId: string,
    targetDate: string
  ): Promise<AutoHoursAllocationDictSurplusTime> =>
    Api.invoke({
      path: '/time/auto-hours-allocation-dict/valid-surplus-time-registration/get',
      param: { empId, targetDate },
    }).then((result: AutoHoursAllocationDictSurplusTime) => {
      return result;
    }),
};
