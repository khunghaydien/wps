import { Dispatch, Reducer } from 'redux';

import {
  getReport,
  initialStateReport,
  Report,
} from '../../../domain/models/exp/Report';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/EXP/REPORT/GET_SUCCESS',
};

const getSuccess = (body: Report) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

export const actions = {
  get:
    (reportId: string) =>
    (dispatch: Dispatch<any>): void | any => {
      return getReport(reportId)
        .then((res: Report) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};

export default ((state = initialStateReport, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Report, any>;
