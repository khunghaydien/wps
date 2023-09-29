import msg from '@apps/commons/languages';
import { catchBusinessError } from '@commons/actions/app';

import { getWorkingDays, WorkingDays } from '@apps/domain/models/psa/Role';

import { AppDispatch } from '@psa/action-dispatchers/AppThunk';

// eslint-disable-next-line import/prefer-default-export
export const actions = {
  get:
    (projectId: string, startDate: string, endDate: string) =>
    (_dispatch: AppDispatch): void | any =>
      getWorkingDays(projectId, startDate, endDate)
        .then((res: WorkingDays) => res.workingDays)
        .catch((err) => {
          console.log(err);
          _dispatch(
            catchBusinessError(
              msg().Psa_Err_Unexpected,
              msg().Psa_Err_DataLimitExceed,
              msg().Psa_Err_UpdateStartDateEndDate
            )
          );
        }),
};
