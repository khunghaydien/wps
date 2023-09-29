import { Store } from 'redux';

import { actions } from '@attendance/timesheet-pc/modules/ui/legalAgreementRequest/list';

import { IOutputData } from '@attendance/domain/useCases/timesheet/IFetchUseCase';
import UseCases from '@attendance/timesheet-pc/UseCases';

export default (store: Store) =>
  async ({ employeeId, timesheet }: IOutputData): Promise<void> => {
    const { workingTypeList } = timesheet;
    const lastDayWorkingType =
      workingTypeList?.length > 0 ? workingTypeList.slice(-1)[0] : null;
    const useFlag =
      lastDayWorkingType?.useLegalAgreementMonthlyRequest ||
      lastDayWorkingType?.useLegalAgreementYearlyRequest;

    if (useFlag) {
      await UseCases().fetchListLegalAgreementRequest({
        employeeId,
        targetDate: timesheet.endDate,
      });
    } else {
      store.dispatch(
        actions.set({
          requests: [],
          availableRequestTypes: null,
        })
      );
    }
  };
