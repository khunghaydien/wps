import { bindActionCreators } from 'redux';

import nanoid from 'nanoid';

import { loadingEnd, loadingStart } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import AllocateDicRepository from '@apps/repositories/time-tracking/AutoHoursAllocateDictRepository';
import JobPickListRepository from '@apps/repositories/time-tracking/JobPickListRepository';

import {
  AutoHoursAllocationDictItem,
  BasicSetting,
  ExceededActWorkHours,
  FIELD_TYPE,
  getLargestPriority,
  OPERATOR_TYPE,
  OverlappingEvent,
  REFERENCE_SCOPE_TYPE,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';
import { Job } from '@apps/domain/models/time-tracking/Job';

import { actions as JobListActions } from '../modules/entities/jobList';
import { actions as AllocateDicActions } from '../modules/ui/allocateDic';
import { actions as BasicSettingActions } from '../modules/ui/basicSetting';

import { validateDictToSave } from '../validators/AllocateDictValidator';
import AppActions from './App';
import { AppDispatch } from './AppThunk';

type DictItemKeys = keyof AutoHoursAllocationDictItem;

interface AutoHoursAllocateResultService {
  // データ取得
  fetch: (
    empId: string,
    targetDate: string,
    resultItem: AutoHoursAllocationResult | undefined
  ) => Promise<void>;

  // ディクショナリ各レコードの編集
  selectJobFromDropdown: (
    id: string,
    job: AutoHoursAllocationDictItem['job']
  ) => void;
  selectJobFromDialog: (id: string, job: Job) => void;
  editWorkCategory: (
    id: string,
    work: AutoHoursAllocationDictItem['workCategory']
  ) => void;
  editPriority: (
    id: string,
    priority: AutoHoursAllocationDictItem['priority']
  ) => void;
  editItemField: <T extends DictItemKeys = DictItemKeys>(
    id: string,
    key: T,
    value: AutoHoursAllocationDictItem[T]
  ) => void;
  addItem: () => void;
  deleteItem: (id: string) => void;

  // 基本設定各フィールドの編集
  selectBasicJobFromDropdown: (job: AutoHoursAllocationDictItem['job']) => void;
  selectBasicJobFromDialog: (job: Job) => void;
  editBasicWorkCategory: (
    work: AutoHoursAllocationDictItem['workCategory']
  ) => void;
  editOverlappingEvent: (overlappingEvent: OverlappingEvent) => void;
  editExceedActWorkHour: (exceedActWorkHour: ExceededActWorkHours) => void;

  // 保存
  saveDict: (
    empId: string | undefined,
    dictList: AutoHoursAllocationDictItem[],
    basicSetting: BasicSetting
  ) => Promise<void>;
}

export default (dispatch: AppDispatch): AutoHoursAllocateResultService => {
  const appActions = AppActions(dispatch);
  const jobListActions = bindActionCreators(JobListActions, dispatch);
  const allocateDicActions = bindActionCreators(AllocateDicActions, dispatch);
  const basicSettingActions = bindActionCreators(BasicSettingActions, dispatch);

  return {
    // データ取得
    fetch: async (empId, targetDate, resultItem) => {
      dispatch(loadingStart());

      try {
        // データ取得
        const [{ basicSetting, dictList: _dictList }, activeJobList] =
          await Promise.all([
            AllocateDicRepository.fetchAll(empId || null, targetDate),

            // NOTE: 「最近使用したジョブ」の使用は本人操作時に限る
            //       代理操作時には、操作者が使えるジョブが代理先で無効な可能性があるため
            // NOTE: 本人操作時にもfetchにempIdが渡されると意図しない挙動になるので要注意
            !empId ? JobPickListRepository.getJobPickList(targetDate) : [],
          ]);
        const dictList = _dictList ? [..._dictList] : [];

        // 割当結果ダイアログから連携された要素があれば、それを辞書項目リストに追加する
        if (resultItem) {
          // NOTE: 既存項目の変更は、ここに分岐を追加する
          // const existingDictItemIndex = dictList.findIndex((item) => item.internalUniqKey === resultItem.dictItemKey);
          dictList.push({
            key: nanoid(8),
            internalUniqKey: null,
            fieldType: FIELD_TYPE.TITLE,
            operatorType: OPERATOR_TYPE.EQUALS,
            valueText: resultItem.eventTitle || '',
            job: resultItem.job || null,
            workCategory: resultItem.workCategory
              ? {
                  workCategoryId: resultItem.workCategory.id,
                  workCategoryCode: resultItem.workCategory.code,
                  workCategoryName: resultItem.workCategory.name,
                }
              : null,
            referenceScopeType: REFERENCE_SCOPE_TYPE.INDIVIDUAL,
            priority: getLargestPriority(dictList) + 1,
            isFromResult: true,
          });
        }

        // ジョブ選択UIの初期表示のため、辞書項目と基本設定からジョブを収集する
        const allocateDictJobList = dictList
          .filter((item) => item.job)
          .map((item) => {
            return {
              jobId: item.job.id,
              jobCode: item.job.code,
              jobName: item.job.name,
              hasJobType: true,
            };
          });
        if (basicSetting.surplusTimeRegistrationJob) {
          const { id, code, name } = basicSetting.surplusTimeRegistrationJob;
          allocateDictJobList.push({
            jobId: id,
            jobCode: code,
            jobName: name,
            hasJobType: true,
          });
        }

        // storeに投入する
        jobListActions.fetchSuccessActiveJob(
          activeJobList,
          allocateDictJobList
        );
        allocateDicActions.initAutoHoursAllocateDic(dictList);
        basicSettingActions.initAutoHoursAllocateBasic(basicSetting);
      } catch (err) {
        appActions.showErrorNotification(err);
      } finally {
        dispatch(loadingEnd());
      }
    },

    // ディクショナリ各レコードの編集
    selectJobFromDropdown: allocateDicActions.editJob,
    selectJobFromDialog: (id, job) => {
      jobListActions.addJobList(job);
      allocateDicActions.editJob(id, job);
    },
    editWorkCategory: allocateDicActions.editWorkCategory,
    editPriority: allocateDicActions.editPriority,
    editItemField: allocateDicActions.editItemField,
    addItem: allocateDicActions.addItem,
    deleteItem: allocateDicActions.deleteItem,

    // 基本設定各フィールドの編集
    selectBasicJobFromDropdown: basicSettingActions.editJob,
    selectBasicJobFromDialog: (job) => {
      jobListActions.addJobList(job);
      basicSettingActions.editJob(job);
    },
    editBasicWorkCategory: basicSettingActions.editWorkCategory,
    editOverlappingEvent: basicSettingActions.editOverlappingEvent,
    editExceedActWorkHour: basicSettingActions.editExceedActWorkHour,

    // 保存
    saveDict: async (empId, dictList, basicSetting) => {
      dispatch(loadingStart());
      try {
        const dictListArray = Object.values(dictList);

        const [validationResult, validationErrors] =
          validateDictToSave(dictListArray);

        if (!validationResult) {
          const errorMessages = validationErrors.map(
            (e) => (e.label ? `${e.label}: ` : '') + e.message
          );
          allocateDicActions.addValidationErrors(validationErrors);
          appActions.showErrorNotification(new Error(errorMessages.join('\n')));
          return;
        }

        allocateDicActions.clearValidationErrors();
        await AllocateDicRepository.save(empId, dictListArray, basicSetting);
        appActions.showSuccessNotification(msg().Time_Lbl_Saved);
      } catch (err) {
        appActions.showErrorNotification(err);
      } finally {
        dispatch(loadingEnd());
      }
    },
  };
};
