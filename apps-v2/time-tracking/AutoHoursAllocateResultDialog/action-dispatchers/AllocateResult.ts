import { bindActionCreators } from 'redux';

import { loadingEnd, loadingStart } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

import autoHoursAllocateDictRepository from '@apps/repositories/time-tracking/AutoHoursAllocateDictRepository';
import autoHoursAllocateRepository from '@apps/repositories/time-tracking/AutoHoursAllocateRepository';
import jobPickListRepository from '@apps/repositories/time-tracking/JobPickListRepository';

import {
  Alert,
  AutoHoursAllocationDictSurplusTime,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';
import { Job } from '@apps/domain/models/time-tracking/Job';

import { actions as jobActions } from '../modules/entities/jobList';
import { actions as resultActions } from '../modules/ui/allocateResult';

import AppActions from './App';
import { AppDispatch } from './AppThunk';

interface AutoHoursAllocateResultService {
  // データ取得
  fetch: (empId: string, targetDate: string) => Promise<void>;

  // 一括選択
  toggleCheckAll: (checkAllFlg: boolean) => void;

  // 各レコードの編集
  selectJobFromDropdown: (
    id: string,
    job: AutoHoursAllocationResult['job']
  ) => void;
  selectJobFromDialog: (id: string, job: Job) => void;
  selectWorkCategory: (
    id: string,
    work: AutoHoursAllocationResult['workCategory']
  ) => void;
  selectTaskTime: (id: string, taskTime: number) => void;
  toggleCheckbox: (id: string, checkboxFlg: boolean) => void;

  // 取込
  apply: ({
    empId,
    targetDate,
    results,
    onApply,
    onClose,
  }: {
    empId: string;
    targetDate: string;
    results: AutoHoursAllocationResult[];
    onApply: (
      results: AutoHoursAllocationResult[],
      surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime
    ) => void;
    onClose: () => void;
  }) => Promise<void>;
}

export default (dispatch: AppDispatch): AutoHoursAllocateResultService => {
  const app = AppActions(dispatch);
  const jobList = bindActionCreators(jobActions, dispatch);
  const allocateResult = bindActionCreators(resultActions, dispatch);
  return {
    // データ取得
    fetch: async (empId, targetDate) => {
      dispatch(loadingStart());
      try {
        const [[allocateList, alerts], activeJobList] = await Promise.all([
          autoHoursAllocateRepository.fetchAll(empId || null, targetDate),

          // NOTE: 「最近使用したジョブ」の使用は本人操作時に限る
          //       代理操作時には、操作者が使えるジョブが代理先で無効な可能性があるため
          // NOTE: 本人操作時にもfetchにempIdが渡されると意図しない挙動になるので要注意
          !empId ? jobPickListRepository.getJobPickList(targetDate) : [],
        ]);
        const allocateJobList = allocateList
          .filter((item) => item.job)
          .map((item) => ({
            jobId: item.job.id,
            jobCode: item.job.code,
            jobName: item.job.name,
            hasJobType: item.job.hasJobType,
          }));

        allocateResult.initAutoHoursAllocate(allocateList);
        jobList.fetchSuccessActiveJob(activeJobList, allocateJobList);

        // show basic setting warning toast
        if (alerts?.some((alert) => alert.level === 'Warn')) {
          app.showWarnNotification(buildWarnMessage(alerts));
        }
      } catch (err) {
        app.showErrorNotification(err);
      } finally {
        dispatch(loadingEnd());
      }
    },

    // 一括選択
    toggleCheckAll: allocateResult.toggleCheckAll,

    // 各レコードの編集
    selectJobFromDropdown: allocateResult.selectRowJob,
    selectJobFromDialog: (rowId, job) => {
      jobList.addJobList(job);
      const { id, code, name, hasJobType } = job;
      allocateResult.selectRowJob(rowId, { id, code, name, hasJobType });
    },
    selectWorkCategory: allocateResult.selectRowWork,
    selectTaskTime: allocateResult.selectTaskTime,
    toggleCheckbox: allocateResult.toggleCheckbox,

    // 取込
    apply: async ({ empId, targetDate, results, onApply, onClose }) => {
      // 抽出（チェック付いてる）
      const resultsToBeImported = results.filter((result) => result.import);

      // エラーチェック（ジョブが無い）
      const errors = resultsToBeImported
        .map((result) => result.job)
        .some((validateResult) => !validateResult);

      if (errors) {
        app.showErrorNotification({
          name: 'NoJob',
          message: msg().Time_Err_PleaseSelectJob,
        });
        return;
      }

      // 抽出（時間が0より大きい）
      const resultsToBeImportedFilterTime = resultsToBeImported.filter(
        (result) => result.taskTime > 0
      );

      dispatch(loadingStart());
      try {
        // 取得 余剰時間登録の設定
        const surplusTimeRegistrationSetting =
          await autoHoursAllocateDictRepository.fetchSurplusTime(
            empId || null,
            targetDate
          );

        const { alerts } = surplusTimeRegistrationSetting;
        if (alerts?.some((alert) => alert.level === 'Warn')) {
          // show basic setting warning confirm dialog
          dispatch(loadingEnd());
          if (
            (await app.confirm(
              buildWarnMessage(alerts) + '\n' + msg().Time_Msg_ExecuteImport
            )) === false
          ) {
            return;
          }
        }
        // 余剰時間登録の設定が無く、かつ取込対象が0件の場合はエラーを表示して処理を中断する
        // NOTE: 余剰時間登録の設定がある場合は、取込0件でも余剰時間登録ジョブを適用する
        if (
          surplusTimeRegistrationSetting.jobId === null &&
          resultsToBeImportedFilterTime.length === 0
        ) {
          app.showErrorNotification({
            name: 'NoData',
            message: msg().Time_Err_NoDataSelected,
          });
          return;
        }

        onApply(resultsToBeImportedFilterTime, surplusTimeRegistrationSetting);
        onClose();
      } catch (err) {
        app.showErrorNotification(err);
      } finally {
        dispatch(loadingEnd());
      }
    },
  };
};

const buildWarnMessage = (warnings: Alert[]): string => {
  const messages = warnings.map((warning) => {
    switch (warning.code) {
      case 'TIME_WARN_DICTBASE_NOT_FOUND':
        return msg().Time_Msg_DictbaseNotFound;
      case 'TIME_WARN_INVALID_JOB':
        return TextUtil.template(
          msg().Time_Msg_InvalidJob,
          warning.params.code
        );
      case 'TIME_WARN_LOCKED_JOB':
        return TextUtil.template(msg().Time_Msg_LockedJob, warning.params.code);
      case 'TIME_WARN_INVALID_WORK_CATEGORY':
        return TextUtil.template(
          msg().Time_Msg_InvalidWorkCategory,
          warning.params.code
        );
      default:
        return '';
    }
  });
  return messages.join('\n');
};
