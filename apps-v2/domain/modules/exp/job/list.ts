import { Reducer } from 'redux';

import {
  getJobList,
  getRecentlyUsed,
  JobList,
  searchJobByKeyword,
} from '../../../models/exp/Job';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/EXP/JOB/LIST_SUCCESS',
};

const listSuccess = (jobList: JobList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: jobList,
});

export const actions = {
  list:
    (
      parentId?: string,
      targetDate?: string,
      empId?: string,
      empHistoryId?: string
    ) =>
    (dispatch: AppDispatch): Promise<{ payload: JobList; type: string }> => {
      return getJobList(empId, parentId, targetDate, null, empHistoryId)
        .then((res: JobList) => dispatch(listSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  getRecentlyUsed:
    (targetDate: string, empId: string, companyId: string) =>
    (dispatch: AppDispatch): Promise<{ payload: JobList; type: string }> => {
      return getRecentlyUsed(targetDate, empId, companyId)
        .then((res: JobList) => dispatch(listSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
  getJobSearchResult:
    (
      keyword: string,
      targetDate: string,
      employeeId: string,
      usedIn?: string,
      companyId?: string,
      empHistoryId?: string
    ) =>
    (dispatch: AppDispatch): Promise<{ payload: JobList; type: string }> => {
      return searchJobByKeyword(
        employeeId,
        undefined,
        targetDate,
        keyword,
        usedIn,
        companyId,
        undefined,
        empHistoryId
      )
        .then((res: JobList) => dispatch(listSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<any, any>;
