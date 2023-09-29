import { withLoading } from '../../modules/commons/loading';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as jobListActions } from '../../modules/expense/entities/jobList';

export const getJobList =
  (
    empId: string,
    parentId?: string,
    targetDate?: string,
    limitNumber?: number
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(jobListActions.get(empId, parentId, targetDate, limitNumber))
    );

export const searchJob =
  (
    companyId: string,
    empId: string,
    targetDate: string,
    query: string,
    limitNumber?: number,
    usedIn?: string
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        jobListActions.search(
          companyId,
          empId,
          null,
          targetDate,
          query,
          limitNumber,
          usedIn
        )
      )
    );
