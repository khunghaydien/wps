/**
 * Container 配下で UseCase を作成するのは賛否両論あると思うが
 * Mobile では page = Container になっているのでここで展開することにする
 */
import { Store } from 'redux';

import { getUserSetting } from '@commons/actions/userSetting';

import RequestHistoryRepository from '@attendance/repositories/approval/RequestHistoryRepository';
import DailyObjectivelyEventLogRepository from '@attendance/repositories/DailyObjectivelyEventLogRepository';
import DailyRecordRepository from '@attendance/repositories/DailyRecordRepository';
import FixDailyRequestRepository from '@attendance/repositories/FixDailyRequestRepository';
import RestTimeReasonRepository from '@attendance/repositories/RestTimeReasonRepository';
import TimesheetRepository from '@attendance/repositories/TimesheetRepository';

import createPresenters from '../presenters';
import UseCases from '../UseCases';
import {
  Permission,
  setPermission,
} from '@attendance/application/AccessControlService';
import submitFixDailyRequestAndSaveDailyRecord from '@attendance/application/combinedUseCaseInteractors/SaveDailyRecordAndSubmitFixDailyRequestUseCaseInteractor';
import { create as createUseCaseInteractor } from '@attendance/application/useCaseInteractors';
import fetchApprovalRequestHistory from '@attendance/application/useCaseInteractors/approval/requestHistory/FetchListUseCaseInteractor';
import fetchRestTimeReasons from '@attendance/application/useCaseInteractors/dailyRecord/FetchRestTimeReasonsUseCaseInteractor';
import saveDailyRecord from '@attendance/application/useCaseInteractors/dailyRecord/SaveUseCaseInteractor';
import cancelApprovalFixDailyRequest from '@attendance/application/useCaseInteractors/fixDailyRequest/CancelApprovalUseCaseInteractor';
import cancelSubmittedFixDailyRequest from '@attendance/application/useCaseInteractors/fixDailyRequest/CancelSubmittedUseCaseInteractor';
import submitFixDailyRequest from '@attendance/application/useCaseInteractors/fixDailyRequest/SubmitUseCaseInteractor';
import { IPresenter } from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import fetchTimesheet from '@attendance/application/useCaseInteractors/timesheet/FetchEntityUseCaseInteractor';

export default ({
  store,
  permission,
}: {
  store: Store;
  permission: Permission;
}): void => {
  setPermission(permission);

  const repositories = {
    TimesheetRepository,
    DailyRecordRepository,
    DailyObjectivelyEventLogRepository,
    FixDailyRequestRepository,
    RequestHistoryRepository,
    RestTimeReasonRepository,
  };

  const UseCaseInteractors = createUseCaseInteractor({
    fetchUserSetting: (_: IPresenter) => () => getUserSetting()(store.dispatch),
    fetchTimesheet: fetchTimesheet(repositories),
    saveDailyRecord: saveDailyRecord(repositories),
    submitFixDailyRequest: submitFixDailyRequest(repositories),
    cancelSubmittedFixDailyRequest:
      cancelSubmittedFixDailyRequest(repositories),
    cancelApprovalFixDailyRequest: cancelApprovalFixDailyRequest(repositories),
    fetchApprovalRequestHistory: fetchApprovalRequestHistory(repositories),
    fetchRestTimeReasons: fetchRestTimeReasons(repositories),
  });

  const presenters = createPresenters(store);

  const PrimitiveUseCaseMethods = {
    fetchUserSetting: UseCaseInteractors.fetchUserSetting(
      presenters.general.fetchUserSetting
    ),
    fetchTimesheet: UseCaseInteractors.fetchTimesheet(
      presenters.timesheet.fetch
    ),
    saveDailyRecord: UseCaseInteractors.saveDailyRecord(
      presenters.dailyRecord.save.normal
    ),
    fetchRestTimeReasons: UseCaseInteractors.fetchRestTimeReasons(
      presenters.dailyRecord.fetchRestTimeReasons
    ),
    submitFixDailyRequest: UseCaseInteractors.submitFixDailyRequest(
      presenters.fixDailyRequest.submit
    ),
    cancelSubmittedFixDailyRequest:
      UseCaseInteractors.cancelSubmittedFixDailyRequest(
        presenters.fixDailyRequest.cancelSubmitted
      ),
    cancelApprovalFixDailyRequest:
      UseCaseInteractors.cancelApprovalFixDailyRequest(
        presenters.fixDailyRequest.cancelApproval
      ),
    fetchApprovalRequestHistory: UseCaseInteractors.fetchApprovalRequestHistory(
      presenters.approval.requestHistory.fetchList
    ),
  };

  const CombinedUseCaseInteractors = createUseCaseInteractor({
    submitFixDailyRequestAndSaveDailyRecord:
      submitFixDailyRequestAndSaveDailyRecord({
        saveDailyRecord: UseCaseInteractors.saveDailyRecord(
          presenters.dailyRecord.save.noCompleteMessage
        ),
        submitFixDailyRequest: PrimitiveUseCaseMethods.submitFixDailyRequest,
      }),
  });

  const CombinedUseCaseMethods = {
    submitFixDailyRequestAndSaveDailyRecord:
      CombinedUseCaseInteractors.submitFixDailyRequestAndSaveDailyRecord(
        presenters.combined.submitFixDailyRequestAndSaveDailyRecord
      ),
  };

  UseCases.register({
    ...PrimitiveUseCaseMethods,
    ...CombinedUseCaseMethods,
  });
};
