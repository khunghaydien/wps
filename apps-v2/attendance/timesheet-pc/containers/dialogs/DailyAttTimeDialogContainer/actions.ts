import LocalEvents from './events';
import { IInputData as ISaveDailyRecordInputData } from '@attendance/domain/useCases/dailyRecord/ISaveUseCase';
import { IInputData as ISubmitFixRequestInputData } from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';
import { IInputData as ISaveDailyDeviationReasonInputData } from '@attendance/domain/useCases/objectivelyEventLog/ISaveDailyDeviationReasonUseCase';
import UseCases from '@attendance/timesheet-pc/UseCases';

export const saveAndSubmitFixDailyRequest = async (param: {
  dailyRecord: ISaveDailyRecordInputData;
  dailyRequestSummary: ISubmitFixRequestInputData['dailyRequestSummary'];
}): Promise<void> => {
  const result = await UseCases().submitFixDailyRequestAndSaveDailyRecord(
    param
  );
  LocalEvents.submittedRequest.publish(result);
};

export const submitRequest = async (
  record: ISubmitFixRequestInputData
): Promise<void> => {
  const result = await UseCases()
    .submitFixDailyRequest(record)
    .then(({ result }) => result)
    .catch(() => false);

  LocalEvents.submittedRequest.publish(result);
};

export const cancelApproval = async (id: string): Promise<void> => {
  await UseCases().cancelApprovalFixDailyRequest(id);
  LocalEvents.canceledApprovalRequest.publish();
};

export const cancelRequest = async (id: string): Promise<void> => {
  await UseCases().cancelSubmittedFixDailyRequest(id);
  LocalEvents.canceledSubmittedRequest.publish();
};

export const save = async (
  record: ISaveDailyRecordInputData
): Promise<void> => {
  const result = await UseCases()
    .saveDailyRecord(record)
    .then(() => true)
    .catch(() => false);
  LocalEvents.saved.publish(result);
};

export const saveDailyObjectivelyEventLogDeviationReason = async (
  record: ISaveDailyDeviationReasonInputData
): Promise<void> => {
  const result = await UseCases()
    .saveDailyObjectivelyEventLogDeviationReason(record)
    .then(() => true)
    .catch(() => false);
  LocalEvents.saved.publish(result);
};
