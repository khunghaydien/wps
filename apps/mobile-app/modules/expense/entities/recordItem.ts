import { Reducer } from 'redux';

import { getReport, Report } from '../../../../domain/models/exp/Report';

// import { catchApiError } from '../../../../commons/actions/app';
import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/EXP/RECORD_ITEM/GET_SUCCESS',
};

const getSuccess = (report: Report) => {
  return {
    type: ACTIONS.GET_SUCCESS,
    payload: report,
  };
};

export const actions = {
  get:
    (reportNo: string) =>
    (dispatch: AppDispatch): Promise<{ payload: Report; type: string }> => {
      return getReport(reportNo).then((res: Report) =>
        dispatch(getSuccess(res))
      );
    },
};

const initialState = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Report | null, any>;
