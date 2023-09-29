import { Dispatch, Reducer } from 'redux';

import {
  ApprRequestList,
  fetchApprRequestList,
} from '../../../../domain/models/approval/request/Request';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/APPROVAL/LIST_SUCCESS',
  SET_SELECT: 'MODULES/ENTITIES/APPROVAL/SET/SELECT',
};

export type ListSuccessAction = {
  type: 'MODULES/ENTITIES/APPROVAL/LIST_SUCCESS';
  payload: ApprRequestList;
};

export type SetSelectAction = {
  type: 'MODULES/ENTITIES/APPROVAL/SET/SELECT';
  payload: string;
};

const listSuccess = (apprRequestList: ApprRequestList) => {
  return {
    type: ACTIONS.LIST_SUCCESS,
    payload: apprRequestList,
  };
};

const setSelection = (selectedVal: string) => {
  return {
    type: ACTIONS.SET_SELECT,
    payload: selectedVal,
  };
};

export type Action = ListSuccessAction;

export const actions = {
  list:
    () =>
    (dispatch: Dispatch<any>): Promise<ApprRequestList> => {
      return fetchApprRequestList().then((res: ApprRequestList) =>
        dispatch(listSuccess(res))
      );
    },
  setSelect: (selection: string) => (dispatch: Dispatch<any>) => {
    return dispatch(setSelection(selection));
  },
};

const initialState = { approvalList: [], select: 'all' };
type State = { approvalList?: ApprRequestList; select: string };

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return { ...initialState, approvalList: action.payload };
    case ACTIONS.SET_SELECT:
      return { ...initialState, select: action.payload };
    default:
      return state;
  }
}) as Reducer<State, any>;
