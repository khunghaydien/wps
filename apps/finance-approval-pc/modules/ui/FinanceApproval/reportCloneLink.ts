import { Reducer } from 'redux';

const ACTIONS = {
  SET: 'MODULES/UI/FINANCE_APPROVAL/REPORT_CLONE_LINK/SET',
  RESET: 'MODULES/UI/FINANCE_APPROVAL/REPORT_CLONE_LINK/RESET',
};

export const actions = {
  setReportCloneLink: (reportId: string, isExpenseReport: boolean) => ({
    type: ACTIONS.SET,
    payload: { reportId, isExpenseReport },
  }),
  reset: () => ({
    type: ACTIONS.RESET,
  }),
};

type State = {
  isExpenseReport: boolean;
  reportId: string | null;
};
const initialState = {
  isExpenseReport: true,
  reportId: null,
};

export default ((state: State = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}) as Reducer<State, any>;
