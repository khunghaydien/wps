import UseCaseCollection from '@attendance/application/UseCaseCollection';
import { IUseCase as ISubmitFixDailyRequestAndSaveDailyRecordUseCase } from '@attendance/domain/combinedUseCases/ISaveDailyRecordAndSubmitFixDailyRequestUseCase';
import { IUseCase as IApprovalRequestHistoryFetchListUseCase } from '@attendance/domain/useCases/approval/RequestHistory/IFetchListUseCase';
import { IUseCase as IDailyRecordFetchRestTimeReasonsUseCase } from '@attendance/domain/useCases/dailyRecord/IFetchRestTimeReasonsUseCase';
import { IUseCase as IDailyRecordSaveUseCase } from '@attendance/domain/useCases/dailyRecord/ISaveUseCase';
import { IUseCase as IFixDailyRequestCancelApprovalUseCase } from '@attendance/domain/useCases/fixDailyRequest/ICancelApprovalUseCase';
import { IUseCase as IFixDailyRequestCancelSubmittedUseCase } from '@attendance/domain/useCases/fixDailyRequest/ICancelSubmittedUseCase';
import { IUseCase as ISubmitFixDailyRequestUseCase } from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';
import { IUseCase as IGeneralFetchUserSettingUseCase } from '@attendance/domain/useCases/general/IFetchUserSettingUseCase';
import { IUseCase as ITimesheetFetchUseCase } from '@attendance/domain/useCases/timesheet/IFetchEntityUseCase';

export type UseCases = {
  fetchUserSetting: IGeneralFetchUserSettingUseCase;
  fetchTimesheet: ITimesheetFetchUseCase;
  saveDailyRecord: IDailyRecordSaveUseCase;
  fetchRestTimeReasons: IDailyRecordFetchRestTimeReasonsUseCase;
  submitFixDailyRequest: ISubmitFixDailyRequestUseCase;
  cancelSubmittedFixDailyRequest: IFixDailyRequestCancelSubmittedUseCase;
  cancelApprovalFixDailyRequest: IFixDailyRequestCancelApprovalUseCase;
  fetchApprovalRequestHistory: IApprovalRequestHistoryFetchListUseCase;
  submitFixDailyRequestAndSaveDailyRecord: ISubmitFixDailyRequestAndSaveDailyRecordUseCase;
};

const service = UseCaseCollection<UseCases>(
  "MobileTimesheetDailyPage's UseCase Service"
);

export default service;
