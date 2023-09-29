import mapValues from 'lodash/fp/mapValues';

import { getUserSetting } from '@commons/actions/userSetting';

import EarlyLeaveReasonRepository from '@attendance/repositories/EarlyLeaveReasonRepository';
import ContractedWorkTimeRepository from '@attendance/repositories/importer/ContractedWorkTimeRepository';
import ImporterTimesheetRepository from '@attendance/repositories/importer/TimesheetRepository';
import LateArrivalReasonRepository from '@attendance/repositories/LateArrivalReasonRepository';
import LeaveRepository from '@attendance/repositories/LeaveRepository';
import RestTimeReasonRepository from '@attendance/repositories/RestTimeReasonRepository';

import setupSubscriber from '../subscribers';
import UseCases from '../UseCases';
import {
  Permission,
  setPermission,
} from '@attendance/application/AccessControlService';
import checkAndSaveTimesheet from '@attendance/application/combinedUseCaseInteractors/importer/CheckAndSaveTimesheetUseCaseInteractor';
import { create as createUseCaseInteractor } from '@attendance/application/useCaseInteractors';
import fetchRestTimeReasons from '@attendance/application/useCaseInteractors/dailyRecord/FetchRestTimeReasonsUseCaseInteractor';
import fetchEarlyLeaveReasons from '@attendance/application/useCaseInteractors/dailyRequest/earlyLeaveRequest/FetchReasonsUseCaseInteractor';
import fetchLateArrivalReasons from '@attendance/application/useCaseInteractors/dailyRequest/lateArrivalRequest/FetchReasonsUseCaseInteractor';
import checkTimesheet from '@attendance/application/useCaseInteractors/importer/timesheet/CheckUseCaseInteractor';
import fetchContractedWorkTimes from '@attendance/application/useCaseInteractors/importer/timesheet/FetchContractedWorkTimesUseCaseInteractor';
import saveTimesheet from '@attendance/application/useCaseInteractors/importer/timesheet/SaveUseCaseInteractor';
import fetchLeaves from '@attendance/application/useCaseInteractors/leave/FetchListUseCaseInteractor';
import createExecutor from '@attendance/libraries/FirstSerialProcessExecutor';
import createPresenter from '@attendance/timesheet-pc-importer/presenters';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

export default ({
  store,
  permission,
}: {
  store: AppStore;
  permission: Permission;
}): void => {
  setPermission(permission);

  // 勤怠サマリーが作成されていない場合に備えて一回目だけ必ず直列実行させるための関数です。
  const mapWaitAttSummary = mapValues(createExecutor()) as <T>(
    repository: T
  ) => T;

  const Presenters = createPresenter(store);

  const Repositories = {
    RestTimeReasonRepository: mapWaitAttSummary(RestTimeReasonRepository),
    LeaveRepository: mapWaitAttSummary(LeaveRepository),
    EarlyLeaveReasonRepository: mapWaitAttSummary(EarlyLeaveReasonRepository),
    LateArrivalReasonRepository: mapWaitAttSummary(LateArrivalReasonRepository),
    ImporterTimesheetRepository,
    ContractedWorkTimeRepository,
  };

  const UseCaseInteractors = createUseCaseInteractor({
    fetchLeaves: fetchLeaves(Repositories),
    fetchRestTimeReasons: fetchRestTimeReasons(Repositories),
    fetchRestTimeReasonsForBulk: fetchRestTimeReasons({
      RestTimeReasonRepository,
    }),
    fetchEarlyLeaveReasons: fetchEarlyLeaveReasons(Repositories),
    fetchLateArrivalReasons: fetchLateArrivalReasons(Repositories),
    fetchContractedWorkTimes: fetchContractedWorkTimes(Repositories),
    checkTimesheet: checkTimesheet(Repositories),
    saveTimesheet: saveTimesheet(Repositories),
  });

  const PrimitiveUseCaseMethods = {
    fetchUserSetting: () => getUserSetting()(store.dispatch),
    fetchRestTimeReasons: UseCaseInteractors.fetchRestTimeReasons(
      Presenters.dailyRecord.fetchRestTimeReasons
    ),
    fetchRestTimeReasonsForBulk: UseCaseInteractors.fetchRestTimeReasonsForBulk(
      Presenters.dailyRecord.fetchRestTimeReasonsForBulk
    ),
    fetchLeaves: UseCaseInteractors.fetchLeaves(Presenters.leave.fetchList),
    fetchEarlyLeaveReasons: UseCaseInteractors.fetchEarlyLeaveReasons(
      Presenters.dailyRequest.earlyLeaveRequest.fetchReasons
    ),
    fetchLateArrivalReasons: UseCaseInteractors.fetchLateArrivalReasons(
      Presenters.dailyRequest.lateArrivalRequest.fetchReasons
    ),
    fetchContractedWorkTimes: UseCaseInteractors.fetchContractedWorkTimes(
      Presenters.importer.timesheet.fetchContractedWorkTimes
    ),
    saveTimesheet: UseCaseInteractors.saveTimesheet(
      Presenters.importer.timesheet.save
    ),
    checkTimesheet: UseCaseInteractors.checkTimesheet(
      Presenters.importer.timesheet.check
    ),
  };

  const CombinedUseCaseInteractors = createUseCaseInteractor({
    checkAndSaveTimesheet: checkAndSaveTimesheet(PrimitiveUseCaseMethods),
  });

  UseCases.register({
    ...PrimitiveUseCaseMethods,
    saveTimesheet: CombinedUseCaseInteractors.checkAndSaveTimesheet(
      Presenters.importer.combined.checkAndSaveTimesheet
    ),
  });
  setupSubscriber(store);
};
