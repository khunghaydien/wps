import { Store } from 'redux';

import DailyObjectivelyEventLogDeviationReasonRepository from '@attendance/repositories/DailyObjectivelyEventLogDeviationReasonRepository';
import DailyObjectivelyEventLogRepository from '@attendance/repositories/DailyObjectivelyEventLogRepository';
import DailyRecordDisplayFieldLayoutRepository from '@attendance/repositories/DailyRecordDisplayFieldLayoutRepository';
import DailyRecordRepository from '@attendance/repositories/DailyRecordRepository';
import DailyStampTimeRepository from '@attendance/repositories/DailyStampTimeRepository';
import FixDailyRequestRepository from '@attendance/repositories/FixDailyRequestRepository';
import LegalAgreementOvertimeRepository from '@attendance/repositories/LegalAgreementOvertimeRepository';
import LegalAgreementRequestRepository from '@attendance/repositories/LegalAgreementRequestRepository';
import ObjectivelyEventLogRepository from '@attendance/repositories/ObjectivelyEventLogRepository';
import RestTimeReasonRepository from '@attendance/repositories/RestTimeReasonRepository';
import TimesheetRepository from '@attendance/repositories/TimesheetRepository';

import createPresenter from '../presenters';
import setupSubscriber from '../subscribers';
import UseCases from '../UseCases';
import saveFields from '@apps/attendance/application/useCaseInteractors/dailyRecord/SaveFieldsUseCaseInteractor';
import {
  Permission,
  setPermission,
} from '@attendance/application/AccessControlService';
import submitFixDailyRequestAndSaveDailyRecord from '@attendance/application/combinedUseCaseInteractors/SaveDailyRecordAndSubmitFixDailyRequestUseCaseInteractor';
import submitFixDailyRequestWithClockOut from '@attendance/application/combinedUseCaseInteractors/SubmitFixDailyRequestWithClockOutUseCaseInteractor';
import { create as createUseCaseInteractor } from '@attendance/application/useCaseInteractors';
import fetchRestTimeReasons from '@attendance/application/useCaseInteractors/dailyRecord/FetchRestTimeReasonsUseCaseInteractor';
import saveDailyRecord from '@attendance/application/useCaseInteractors/dailyRecord/SaveUseCaseInteractor';
import cancelApprovalFixDailyRequest from '@attendance/application/useCaseInteractors/fixDailyRequest/CancelApprovalUseCaseInteractor';
import cancelSubmittedFixDailyRequest from '@attendance/application/useCaseInteractors/fixDailyRequest/CancelSubmittedUseCaseInteractor';
import submitFixDailyRequest from '@attendance/application/useCaseInteractors/fixDailyRequest/SubmitUseCaseInteractor';
import fetchOvertimeLegalAgreement from '@attendance/application/useCaseInteractors/legalAgreement/FetchOvertimeUseCaseInteractor';
import cancelApprovalLegalAgreementRequest from '@attendance/application/useCaseInteractors/legalAgreementRequest/CancelApprovalUseCaseInteractor';
import cancelRequestLegalAgreementRequest from '@attendance/application/useCaseInteractors/legalAgreementRequest/CancelRequestUseCaseInteractor';
import fetchListLegalAgreementRequest from '@attendance/application/useCaseInteractors/legalAgreementRequest/FetchListUseCaseInteractor';
import reapplyLegalAgreementRequest from '@attendance/application/useCaseInteractors/legalAgreementRequest/ReapplyUseCaseInteractor';
import removeLegalAgreementRequest from '@attendance/application/useCaseInteractors/legalAgreementRequest/RemoveUseCaseInteractor';
import submitLegalAgreementRequest from '@attendance/application/useCaseInteractors/legalAgreementRequest/SubmitUseCaseInteractor';
import createObjectivelyEventLog from '@attendance/application/useCaseInteractors/objectivelyEventLog/CreateUseCaseInteractor';
import fetchDailyObjectivelyEventLogDeviationReasons from '@attendance/application/useCaseInteractors/objectivelyEventLog/FetchDailyDeviationReasonsUseCaseInteractor';
import fetchDailyObjectivelyEventLogs from '@attendance/application/useCaseInteractors/objectivelyEventLog/FetchDailyUseCaseInteractor';
import fetchObjectivelyEventLogs from '@attendance/application/useCaseInteractors/objectivelyEventLog/FetchUseCaseInteractor';
import removeObjectivelyEventLog from '@attendance/application/useCaseInteractors/objectivelyEventLog/RemoveUseCaseInteractor';
import saveDailyObjectivelyEventLogDeviationReason from '@attendance/application/useCaseInteractors/objectivelyEventLog/SaveDailyDeviationReasonUseCaseInteractor';
import setToBeAppliedToDailyObjectivelyEventLogs from '@attendance/application/useCaseInteractors/objectivelyEventLog/SetToBeAppliedToDailyUseCaseInteractor';
import stampTime from '@attendance/application/useCaseInteractors/stampTime/PostUseCaseInteractor';
import fetchDailyFieldLayoutTable from '@attendance/application/useCaseInteractors/timesheet/FetchTableUseCaseInteractor';
import fetchTimesheet from '@attendance/application/useCaseInteractors/timesheet/FetchUseCaseInteractor';

export default ({
  store,
  permission,
}: {
  store: Store;
  permission: Permission;
}): void => {
  setPermission(permission);

  const presenters = createPresenter(store);

  const repositories = {
    DailyObjectivelyEventLogRepository,
    DailyObjectivelyEventLogDeviationReasonRepository,
    DailyRecordRepository,
    DailyStampTimeRepository,
    TimesheetRepository,
    ObjectivelyEventLogRepository,
    FixDailyRequestRepository,
    RestTimeReasonRepository,
    LegalAgreementOvertimeRepository,
    LegalAgreementRequestRepository,
    DailyRecordDisplayFieldLayoutRepository,
  };

  const UseCaseInteractors = createUseCaseInteractor({
    fetchTimesheet: fetchTimesheet(repositories),
    fetchObjectivelyEventLogs: fetchObjectivelyEventLogs(repositories),
    setToBeAppliedToDailyObjectivelyEventLogs:
      setToBeAppliedToDailyObjectivelyEventLogs(repositories),
    createObjectivelyEventLog: createObjectivelyEventLog(repositories),
    removeObjectivelyEventLog: removeObjectivelyEventLog(repositories),
    fetchDailyObjectivelyEventLogs:
      fetchDailyObjectivelyEventLogs(repositories),
    saveDailyRecord: saveDailyRecord(repositories),
    saveDailyObjectivelyEventLogDeviationReason:
      saveDailyObjectivelyEventLogDeviationReason(repositories),
    submitFixDailyRequest: submitFixDailyRequest(repositories),
    cancelSubmittedFixDailyRequest:
      cancelSubmittedFixDailyRequest(repositories),
    cancelApprovalFixDailyRequest: cancelApprovalFixDailyRequest(repositories),
    stampTime: stampTime(repositories),
    fetchRestTimeReasons: fetchRestTimeReasons(repositories),
    fetchDailyObjectivelyEventLogDeviationReasons:
      fetchDailyObjectivelyEventLogDeviationReasons(repositories),
    fetchListLegalAgreementRequest:
      fetchListLegalAgreementRequest(repositories),
    fetchOvertimeLegalAgreement: fetchOvertimeLegalAgreement(repositories),
    submitLegalAgreementRequest: submitLegalAgreementRequest(repositories),
    cancelRequestLegalAgreementRequest:
      cancelRequestLegalAgreementRequest(repositories),
    cancelApprovalLegalAgreementRequest:
      cancelApprovalLegalAgreementRequest(repositories),
    removeLegalAgreementRequest: removeLegalAgreementRequest(repositories),
    reapplyLegalAgreementRequest: reapplyLegalAgreementRequest(repositories),
    fetchDailyFieldLayoutTable: fetchDailyFieldLayoutTable(repositories),
    saveFields: saveFields(repositories),
  });

  const PrimitiveUseCaseMethods = {
    fetchTimesheet: UseCaseInteractors.fetchTimesheet(
      presenters.timesheet.fetch
    ),
    reloadTimesheetOnly: UseCaseInteractors.fetchTimesheet(
      presenters.timesheet.fetch
    ),
    fetchObjectivelyEventLogs: UseCaseInteractors.fetchObjectivelyEventLogs(
      presenters.objectivelyEventLog.fetch
    ),
    setToBeAppliedToDailyObjectivelyEventLog:
      UseCaseInteractors.setToBeAppliedToDailyObjectivelyEventLogs(
        presenters.objectivelyEventLog.setToBeAppliedToDaily
      ),
    createObjectivelyEventLog: UseCaseInteractors.createObjectivelyEventLog(
      presenters.objectivelyEventLog.create
    ),
    removeObjectivelyEventLog: UseCaseInteractors.removeObjectivelyEventLog(
      presenters.objectivelyEventLog.remove
    ),
    reloadDailyObjectivelyEventLogs:
      UseCaseInteractors.fetchDailyObjectivelyEventLogs(
        presenters.objectivelyEventLog.fetchDaily.reload
      ),
    reloadOneDailyObjectivelyEventLog:
      UseCaseInteractors.fetchDailyObjectivelyEventLogs(
        presenters.objectivelyEventLog.fetchDaily.reloadOneRecord
      ),
    saveDailyRecord: UseCaseInteractors.saveDailyRecord(
      presenters.dailyRecord.save
    ),
    saveDailyObjectivelyEventLogDeviationReason:
      UseCaseInteractors.saveDailyObjectivelyEventLogDeviationReason(
        presenters.objectivelyEventLog.saveDailyDeviationReason
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
    stampTime: UseCaseInteractors.stampTime(presenters.stampTime.post),
    fetchRestTimeReasons: UseCaseInteractors.fetchRestTimeReasons(
      presenters.dailyRecord.fetchRestTimeReasons
    ),
    fetchDailyObjectivelyEventLogDeviationReasons:
      UseCaseInteractors.fetchDailyObjectivelyEventLogDeviationReasons(
        presenters.objectivelyEventLog.fetchDailyDeviationReasons
      ),
    fetchListLegalAgreementRequest:
      UseCaseInteractors.fetchListLegalAgreementRequest(
        presenters.legalAgreementRequest.fetchList
      ),
    fetchOvertimeLegalAgreement: UseCaseInteractors.fetchOvertimeLegalAgreement(
      presenters.legalAgreement.fetchOvertime
    ),
    submitLegalAgreementRequest: UseCaseInteractors.submitLegalAgreementRequest(
      presenters.legalAgreementRequest.submit
    ),
    cancelRequestLegalAgreementRequest:
      UseCaseInteractors.cancelRequestLegalAgreementRequest(
        presenters.legalAgreementRequest.cancelRequest
      ),
    cancelApprovalLegalAgreementRequest:
      UseCaseInteractors.cancelApprovalLegalAgreementRequest(
        presenters.legalAgreementRequest.cancelApproval
      ),
    removeLegalAgreementRequest: UseCaseInteractors.removeLegalAgreementRequest(
      presenters.legalAgreementRequest.remove
    ),
    reapplyLegalAgreementRequest:
      UseCaseInteractors.reapplyLegalAgreementRequest(
        presenters.legalAgreementRequest.reapply
      ),
    fetchDailyFieldLayoutTable: UseCaseInteractors.fetchDailyFieldLayoutTable(
      presenters.timesheet.fetchTable
    ),
    saveFields: UseCaseInteractors.saveFields(
      presenters.dailyRecord.saveFields
    ),
  };

  const CombinedUseCaseInteractors = createUseCaseInteractor({
    submitFixDailyRequestAndSaveDailyRecord:
      submitFixDailyRequestAndSaveDailyRecord(PrimitiveUseCaseMethods),
    submitFixDailyRequestWithClockOut: submitFixDailyRequestWithClockOut(
      PrimitiveUseCaseMethods
    ),
  });

  UseCases.register({
    ...PrimitiveUseCaseMethods,
    submitFixDailyRequestWithClockOut:
      CombinedUseCaseInteractors.submitFixDailyRequestWithClockOut(
        presenters.combined.submitFixDailyRequestWithClockOut
      ),
    submitFixDailyRequestAndSaveDailyRecord:
      CombinedUseCaseInteractors.submitFixDailyRequestAndSaveDailyRecord(
        presenters.combined.submitFixDailyRequestAndSaveDailyRecord
      ),
  });

  setupSubscriber(store);
};
