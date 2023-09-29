import { catchApiError, withLoading } from '../../../../commons/actions/app';

import {
  DelegatedApprover,
  getDelegatedApproverList,
  saveDelegatedApprovers,
} from '../../../models/DelegatedApprover';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import { actions as uiActions } from '../ui/assignment';
// State
type State = DelegatedApprover[];

// Action
const ACTIONS = {
  LIST: 'ADMIN/MODULES/DA/ENTITIES/ASSIGNMENT/LIST',
  SAVE: 'ADMIN/MODULES/DA/ENTITIES/ASSIGNMENT/SAVE',
};

type ListDelegatedApprovers = {
  type: 'ADMIN/MODULES/DA/ENTITIES/ASSIGNMENT/LIST';
  payload: DelegatedApprover[];
};

type SaveDelegatedApprovers = {
  type: 'ADMIN/MODULES/DA/ENTITIES/ASSIGNMENT/SAVE';
};

type Action = ListDelegatedApprovers | SaveDelegatedApprovers;

const listSuccess = (
  settingList: Array<DelegatedApprover>
): ListDelegatedApprovers => ({
  // @ts-ignore
  type: ACTIONS.LIST,
  payload: settingList,
});

const saveSuccess = (): SaveDelegatedApprovers => ({
  // @ts-ignore
  type: ACTIONS.SAVE,
});

export const actions = {
  list: (empId: string) => (dispatch: AppDispatch) =>
    dispatch(
      withLoading(() =>
        getDelegatedApproverList(empId).then((settingList) => {
          dispatch(listSuccess(settingList));
          dispatch(uiActions.clearExcludedEmployees());
          dispatch(
            uiActions.initializeExcludedEmployees(
              [empId].concat(settingList.map((x) => x.delegatedApproverId))
            )
          );
        })
      )
    ).catch((err) => dispatch(catchApiError(err, { isContinuable: true }))),

  save:
    (empId: string, settings: Array<DelegatedApprover>) =>
    (dispatch: AppDispatch) =>
      dispatch(
        withLoading(() =>
          saveDelegatedApprovers(empId, settings).then(() => {
            getDelegatedApproverList(empId).then((settingList) => {
              dispatch(listSuccess(settingList));
              dispatch(uiActions.clearExcludedEmployees());
            });
            dispatch(saveSuccess());
          })
        )
      ).catch((err) => dispatch(catchApiError(err, { isContinuable: true }))),
};
// Reducer
const initialState: State = [];

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.LIST: {
      // @ts-ignore
      return action.payload;
    }
    case ACTIONS.SAVE:
    default:
      return state;
  }
};
