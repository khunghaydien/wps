import { Reducer } from 'redux';

import {
  Delegators,
  getDelegatorList,
} from '../../models/exp/DelegateApplicant';

import { AppDispatch } from './AppThunk';

export const ACTIONS = {
  SET: 'MODULES/ENTITIES/EXP/DELEGATE_APPLICANT/SET',
};

const actions = {
  set: (delegatorList: Delegators) => ({
    type: ACTIONS.SET,
    payload: delegatorList,
  }),
};

export const list =
  (empId: string, target: string) =>
  (dispatch: AppDispatch): Promise<{ payload: Delegators; type: string }> => {
    return getDelegatorList(empId, target).then((res: Delegators) =>
      dispatch(actions.set(res))
    );
  };

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Delegators, any>;
