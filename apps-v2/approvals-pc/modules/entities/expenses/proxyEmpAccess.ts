import { Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { fetchUserSetting } from '../../../../commons/actions/userSetting';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';

export type State = {
  employeeId: string;
  companyId: string;
  allowApproveExpInDiffCompany: boolean;
};

const ACTIONS = {
  SET: 'MODULES/ENTITIES/EXPENSES/PROXY_EMP_ACCESS/SET',
  CLEAR: 'MODULES/ENTITIES/EXPENSES/PROXY_EMP_ACCESS/CLEAR',
};

const set = (empInfo: State) => ({
  type: ACTIONS.SET,
  payload: empInfo,
});

export const actions = {
  getProxyEmpAccess: (empId: string) => (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    fetchUserSetting({
      empId,
    })
      .then((res) => {
        const { employeeId, companyId, allowApproveExpInDiffCompany } = res;
        dispatch(
          set({
            employeeId,
            companyId,
            allowApproveExpInDiffCompany,
          })
        );
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  },
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState: State = {
  employeeId: '',
  companyId: '',
  allowApproveExpInDiffCompany: false,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<State, any>;
