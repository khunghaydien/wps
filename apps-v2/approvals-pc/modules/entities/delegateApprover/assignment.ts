import { Dispatch } from 'redux';

import { catchApiError, withLoading } from '../../../../commons/actions/app';

import {
  DelegatedApprover,
  getDelegatedApproverList,
  saveDelegatedApprovers,
} from '../../../models/DelegatedApprover';

import { actions as uiActions } from '../../ui/delegateApprover/assignment';

// State
type State = DelegatedApprover[];

// Action
const ACTIONS = {
  LIST: 'APPROVAL/MODULES/DA/ENTITIES/ASSIGNMENT/LIST',
  SAVE: 'APPROVAL/MODULES/DA/ENTITIES/ASSIGNMENT/SAVE',
};

type ListDelegatedApprovers = {
  type: 'APPROVAL/MODULES/DA/ENTITIES/ASSIGNMENT/LIST';
  payload: DelegatedApprover[];
};

type SaveDelegatedApprovers = {
  type: 'APPROVAL/MODULES/DA/ENTITIES/ASSIGNMENT/SAVE';
};

type Action = ListDelegatedApprovers | SaveDelegatedApprovers;

const listSuccess = (settingList: Array<DelegatedApprover>) => ({
  type: ACTIONS.LIST,
  payload: settingList,
});

const saveSuccess = () => ({
  type: ACTIONS.SAVE,
});

export const actions = {
  list: (empId: string) => (dispatch: Dispatch<any>) =>
    dispatch(
      withLoading(() =>
        getDelegatedApproverList(empId).then((settingList) => {
          dispatch(listSuccess(settingList));
          dispatch(uiActions.clearExcludedEmployees());
          dispatch(
            uiActions.initializeExcludedEmployees(
              settingList.map((x) => x.delegatedApproverId)
            )
          );
        })
      )
      // @ts-ignore
    ).catch((err) => dispatch(catchApiError(err, { isContinuable: true }))),

  save:
    (empId: string, settings: Array<DelegatedApprover>) =>
    (dispatch: Dispatch<any>) =>
      dispatch(
        withLoading(() =>
          saveDelegatedApprovers(empId, settings).then(() => {
            getDelegatedApproverList(empId).then((settingList) => {
              dispatch(listSuccess(settingList));
              dispatch(uiActions.clearExcludedEmployees());
              dispatch(
                uiActions.initializeExcludedEmployees(
                  settingList.map((x) => x.delegatedApproverId)
                )
              );
            });
            dispatch(saveSuccess());
          })
        )
        // @ts-ignore
      ).catch((err) => dispatch(catchApiError(err, { isContinuable: true }))),
};

// Reducer
const initialState: State = [];

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.LIST: {
      return (action as ListDelegatedApprovers).payload;
    }
    case ACTIONS.SAVE:
    default:
      return state;
  }
};
