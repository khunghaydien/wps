import { Reducer } from 'redux';

import { AppDispatch } from '../../AppThunk';

export const ACTIONS = {
  SAVE_VALUES: 'MODULES/EXPENSE/UI/REPORT/SELECTED_REPORT_TYPE/SAVE_VALUES',
  CLEAR_VALUES: 'MODULES/EXPENSE/UI/REPORT/SELECTED_REPORT_TYPE/CLEAR_VALUES',
};

const saveValues = (
  accountingPeriodId: string,
  reportTypeId: string,
  accountingDate?: string
) => ({
  type: ACTIONS.SAVE_VALUES,
  payload: { accountingPeriodId, reportTypeId, accountingDate },
});

const clearValues = () => ({
  type: ACTIONS.CLEAR_VALUES,
});

export const actions = {
  save:
    (
      accountingPeriodId?: string,
      reportTypeId?: string,
      accountingDate?: string
    ) =>
    (dispatch: AppDispatch) =>
      dispatch(saveValues(accountingPeriodId, reportTypeId, accountingDate)),
  clear: () => (dispatch: AppDispatch) => dispatch(clearValues()),
};

const initialState = {
  accountingPeriodId: null,
  reportTypeId: null,
  accountingDate: '',
};

type State = {
  accountingPeriodId: string;
  reportTypeId: string;
  accountingDate: string;
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SAVE_VALUES:
      return { ...action.payload };
    case ACTIONS.CLEAR_VALUES:
      return {};
    default:
      return state;
  }
}) as Reducer<State, any>;
