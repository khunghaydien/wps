import UseCaseCollection from '@attendance/application/UseCaseCollection';
import { IUseCase as IImporterTimesheetSaveUseCase } from '@attendance/domain/combinedUseCases/importer/ICheckAndSaveTimesheetUseCase';
import { IUseCase as IDailyRecordFetchRestTimeReasonsUseCase } from '@attendance/domain/useCases/dailyRecord/IFetchRestTimeReasonsUseCase';
import { IUseCase as IDailyRequestEarlyLeaveRequestFetchReasonsUseCase } from '@attendance/domain/useCases/dailyRequest/earlyLeaveRequest/IFetchReasonsUseCase';
import { IUseCase as IDailyRequestLateArrivalRequestFetchReasonsUseCase } from '@attendance/domain/useCases/dailyRequest/lateArrivalRequest/IFetchReasonsUseCase';
import { IUseCase as IGeneralFetchUserSettingUseCase } from '@attendance/domain/useCases/general/IFetchUserSettingUseCase';
import { IUseCase as IImporterTimesheetCheckUseCase } from '@attendance/domain/useCases/importer/timesheet/ICheckUseCase';
import { IUseCase as IFetchContractedWorkTimesUseCase } from '@attendance/domain/useCases/importer/timesheet/IFetchContractedWorkTimesUseCase';
import { IUseCase as ILeaveFetchListUseCase } from '@attendance/domain/useCases/leave/IFetchListUseCase';

export type UseCases = {
  fetchUserSetting: IGeneralFetchUserSettingUseCase;
  fetchRestTimeReasons: IDailyRecordFetchRestTimeReasonsUseCase;
  fetchRestTimeReasonsForBulk: IDailyRecordFetchRestTimeReasonsUseCase;
  fetchLeaves: ILeaveFetchListUseCase;
  fetchEarlyLeaveReasons: IDailyRequestEarlyLeaveRequestFetchReasonsUseCase;
  fetchLateArrivalReasons: IDailyRequestLateArrivalRequestFetchReasonsUseCase;
  fetchContractedWorkTimes: IFetchContractedWorkTimesUseCase;
  saveTimesheet: IImporterTimesheetSaveUseCase;
  checkTimesheet: IImporterTimesheetCheckUseCase;
};

const service = UseCaseCollection<UseCases>(
  "Timesheet-PC-importer's UseCase Service"
);

export default service;
