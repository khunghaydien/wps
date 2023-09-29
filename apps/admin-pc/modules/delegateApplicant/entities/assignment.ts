import get from 'lodash/get';

import { catchApiError, withLoading } from '../../../../commons/actions/app';

import {
  DelegatedApplicant,
  getDelegatedApplicantList,
  saveDelegatedApplicants,
} from '../../../models/DelegatedApplicant';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import { actions as uiActions } from '../ui/assignment';
// State
type State = DelegatedApplicant[];

// Action
const ACTIONS = {
  LIST: 'DELEGATED_APPLICANT/ENTITIES/ASSIGNMENT/LIST',
  SAVE: 'DELEGATED_APPLICANT/ENTITIES/ASSIGNMENT/SAVE',
};

type ListDelegatedApplicants = {
  type: 'DELEGATED_APPLICANT/ENTITIES/ASSIGNMENT/LIST';
  payload: DelegatedApplicant[];
};

type SaveDelegatedApplicants = {
  type: 'DELEGATED_APPLICANT/ENTITIES/ASSIGNMENT/SAVE';
};

type Action = ListDelegatedApplicants | SaveDelegatedApplicants;

const listSuccess = (
  settingList: Array<DelegatedApplicant>
): ListDelegatedApplicants => ({
  // @ts-ignore
  type: ACTIONS.LIST,
  payload: settingList,
});

const saveSuccess = (): SaveDelegatedApplicants => ({
  // @ts-ignore
  type: ACTIONS.SAVE,
});

export const actions = {
  list: (empId: string) => (dispatch: AppDispatch) =>
    dispatch(
      withLoading(() =>
        getDelegatedApplicantList(empId).then((settingList) => {
          dispatch(listSuccess(settingList));
          dispatch(uiActions.clearExcludedEmployees());
          dispatch(
            uiActions.initializeExcludedEmployees(
              settingList.map((x) => get(x, 'delegatee.id', null))
            )
          );
        })
      )
    ).catch((err) => dispatch(catchApiError(err, { isContinuable: true }))),

  save:
    (empId: string, settings: Array<DelegatedApplicant>) =>
    (dispatch: AppDispatch) =>
      dispatch(
        withLoading(() =>
          saveDelegatedApplicants(empId, settings).then(() => {
            getDelegatedApplicantList(empId).then((settingList) => {
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
