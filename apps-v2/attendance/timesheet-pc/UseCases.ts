import UseCaseCollection from '@attendance/application/UseCaseCollection';
import { IUseCase as ISubmitFixDailyRequestAndSaveDailyRecordUseCase } from '@attendance/domain/combinedUseCases/ISaveDailyRecordAndSubmitFixDailyRequestUseCase';
import { IUseCase as ISubmitFixDailyRequestWithClockOutUseCase } from '@attendance/domain/combinedUseCases/ISubmitFixDailyRequestWithClockOutUseCase';
import { IUseCase as IDailyRecordFetchRestTimeReasonsUseCase } from '@attendance/domain/useCases/dailyRecord/IFetchRestTimeReasonsUseCase';
import { IUseCase as IDailyRecordSaveFieldsUseCase } from '@attendance/domain/useCases/dailyRecord/ISaveFieldsUseCase';
import { IUseCase as IDailyRecordSaveUseCase } from '@attendance/domain/useCases/dailyRecord/ISaveUseCase';
import { IUseCase as IFixDailyRequestCancelApprovalUseCase } from '@attendance/domain/useCases/fixDailyRequest/ICancelApprovalUseCase';
import { IUseCase as IFixDailyRequestCancelSubmittedUseCase } from '@attendance/domain/useCases/fixDailyRequest/ICancelSubmittedUseCase';
import { IUseCase as IFixDailyRequestSubmitUseCase } from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';
import { IUseCase as ILegalAgreementFetchOvertimeUseCase } from '@attendance/domain/useCases/legalAgreement/IFetchOvertimeUseCase';
import { IUseCase as ILegalAgreementRequestApprovalRequestUseCase } from '@attendance/domain/useCases/legalAgreementRequest/ICancelApprovalUseCase';
import { IUseCase as ILegalAgreementRequestCancelRequestUseCase } from '@attendance/domain/useCases/legalAgreementRequest/ICancelRequestUseCase';
import { IUseCase as ILegalAgreementRequestFetchListUseCase } from '@attendance/domain/useCases/legalAgreementRequest/IFetchListUseCase';
import { IUseCase as ILegalAgreementRequestReapplyUseCase } from '@attendance/domain/useCases/legalAgreementRequest/IReapplyUseCase';
import { IUseCase as ILegalAgreementRequestRemoveUseCase } from '@attendance/domain/useCases/legalAgreementRequest/IRemoveUseCase';
import { IUseCase as ILegalAgreementRequestSubmitUseCase } from '@attendance/domain/useCases/legalAgreementRequest/ISubmitUseCase';
import { IUseCase as IObjectivelyEventLogCreateUseCase } from '@attendance/domain/useCases/objectivelyEventLog/ICreateUseCase';
import { IUseCase as IObjectivelyEventLogFetchDailyDeviationReasonsUseCase } from '@attendance/domain/useCases/objectivelyEventLog/IFetchDailyDeviationReasonsUseCase';
import { IUseCase as IObjectivelyEventLogFetchDailyUseCase } from '@attendance/domain/useCases/objectivelyEventLog/IFetchDailyUseCase';
import { IUseCase as IObjectivelyEventLogFetchUseCase } from '@attendance/domain/useCases/objectivelyEventLog/IFetchUseCase';
import { IUseCase as IObjectivelyEventLogRemoveUseCase } from '@attendance/domain/useCases/objectivelyEventLog/IRemoveUseCase';
import { IUseCase as IObjectivelyEventLogSaveDailyDeviationReasonUseCase } from '@attendance/domain/useCases/objectivelyEventLog/ISaveDailyDeviationReasonUseCase';
import { IUseCase as IObjectivelyEventLogSetToBeAppliedToDailyUseCase } from '@attendance/domain/useCases/objectivelyEventLog/ISetToBeAppliedToDailyUseCase';
import { IUseCase as IStampTimePostUseCase } from '@attendance/domain/useCases/stampTime/IPostUseCase';
import { IUseCase as IDisplayFieldLayoutFetchTableUseCase } from '@attendance/domain/useCases/timesheet/IFetchTableUseCase';
import { IUseCase as ITimesheetFetchUseCase } from '@attendance/domain/useCases/timesheet/IFetchUseCase';

export type UseCases = {
  fetchTimesheet: ITimesheetFetchUseCase;
  reloadTimesheetOnly: ITimesheetFetchUseCase;
  fetchObjectivelyEventLogs: IObjectivelyEventLogFetchUseCase;
  fetchDailyObjectivelyEventLogDeviationReasons: IObjectivelyEventLogFetchDailyDeviationReasonsUseCase;
  setToBeAppliedToDailyObjectivelyEventLog: IObjectivelyEventLogSetToBeAppliedToDailyUseCase;
  reloadDailyObjectivelyEventLogs: IObjectivelyEventLogFetchDailyUseCase;
  reloadOneDailyObjectivelyEventLog: IObjectivelyEventLogFetchDailyUseCase;
  createObjectivelyEventLog: IObjectivelyEventLogCreateUseCase;
  removeObjectivelyEventLog: IObjectivelyEventLogRemoveUseCase;
  submitFixDailyRequest: IFixDailyRequestSubmitUseCase;
  submitFixDailyRequestWithClockOut: ISubmitFixDailyRequestWithClockOutUseCase;
  submitFixDailyRequestAndSaveDailyRecord: ISubmitFixDailyRequestAndSaveDailyRecordUseCase;
  cancelSubmittedFixDailyRequest: IFixDailyRequestCancelSubmittedUseCase;
  cancelApprovalFixDailyRequest: IFixDailyRequestCancelApprovalUseCase;
  saveDailyRecord: IDailyRecordSaveUseCase;
  saveDailyObjectivelyEventLogDeviationReason: IObjectivelyEventLogSaveDailyDeviationReasonUseCase;
  stampTime: IStampTimePostUseCase;
  fetchRestTimeReasons: IDailyRecordFetchRestTimeReasonsUseCase;
  fetchListLegalAgreementRequest: ILegalAgreementRequestFetchListUseCase;
  fetchOvertimeLegalAgreement: ILegalAgreementFetchOvertimeUseCase;
  submitLegalAgreementRequest: ILegalAgreementRequestSubmitUseCase;
  cancelRequestLegalAgreementRequest: ILegalAgreementRequestCancelRequestUseCase;
  cancelApprovalLegalAgreementRequest: ILegalAgreementRequestApprovalRequestUseCase;
  removeLegalAgreementRequest: ILegalAgreementRequestRemoveUseCase;
  reapplyLegalAgreementRequest: ILegalAgreementRequestReapplyUseCase;
  fetchDailyFieldLayoutTable: IDisplayFieldLayoutFetchTableUseCase;
  saveFields: IDailyRecordSaveFieldsUseCase;
};

const service = UseCaseCollection<UseCases>("Timesheet-PC's UseCase Service");

export default service;
