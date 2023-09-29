import {
  getEmployeeGroupList,
  getEmployeeGroupListFromPlanner,
  PSAGroup,
} from '../../models/psa/PSAGroup';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/PSA/PSAGROUP/LIST_SUCCESS',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/PSAGROUP/INIT_SUCCESS',
  SET_SELECTED_GROUP: 'MODULES/ENTITIES/PSA/PSAGROUP/SET_SELECTED_GROUP',
};

const setSelectedGroup = (body) => ({
  type: ACTIONS.SET_SELECTED_GROUP,
  payload: {
    selectedGroup: body,
  },
});

const listSuccess = (body) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: {
    groupList: body,
    selectedGroup: body[0],
  },
});

const listSuccessByPsaGroupId = (body, groupId) => {
  const selected = body.filter((g) => g.id === groupId);
  return {
    type: ACTIONS.LIST_SUCCESS,
    payload: {
      groupList: body,
      selectedGroup: selected[0] || body[0],
    },
  };
};

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
});

export const actions = {
  list:
    (companyId: string, groupType = '') =>
    (dispatch: AppDispatch): void | any =>
      getEmployeeGroupList(companyId, groupType)
        .then((res) => dispatch(listSuccess(res)))
        .catch((err) => {
          throw err;
        }),
  listByPsaGroupId:
    (
      companyId: string,
      groupType = '',
      psaGroupId: string,
      employeeId: string
    ) =>
    (dispatch: AppDispatch): void | any =>
      getEmployeeGroupListFromPlanner(companyId, groupType, employeeId)
        .then((res) => dispatch(listSuccessByPsaGroupId(res, psaGroupId)))
        .catch((err) => {
          throw err;
        }),
  initialize:
    () =>
    (dispatch: AppDispatch): Promise<any> =>
      dispatch(initialize()),
  setSelectedGroup:
    (selectedGroup: PSAGroup) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setSelectedGroup(selectedGroup)),
};

const initialState = {
  groupList: [],
  selectedGroup: {},
};

type State = {
  groupList: Array<any>;
  selectedGroup: Record<string, any>;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.SET_SELECTED_GROUP:
    case ACTIONS.LIST_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        initialState,
      };
    default:
      return state;
  }
};
