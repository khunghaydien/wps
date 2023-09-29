import ownerEmployeeId from '@attendance/timesheet-pc-importer/modules/selectors/ownerEmployeeId';

import { IOutputData } from '@attendance/domain/useCases/importer/timesheet/IFetchContractedWorkTimesUseCase';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';
import UseCases from '@attendance/timesheet-pc-importer/UseCases';

export default ({ getState }: AppStore) =>
  async (output: IOutputData): Promise<void> => {
    const employeeId = ownerEmployeeId(getState());
    output.forEach(({ workingTypes }) => {
      workingTypes?.forEach(({ startDate: targetDate }) => {
        UseCases().fetchRestTimeReasonsForBulk({
          employeeId,
          targetDate,
        });
      });
    });
  };
