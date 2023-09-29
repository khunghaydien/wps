import { sortByOrder } from '@apps/commons/utils/psa/ExtendedItemUtil';

import {
  initialPsaExtendedItemList,
  PsaExtendedItemList,
  searchExtendedItem,
} from '@apps/domain/models/psa/PsaExtendedItem';

import { AppDispatch } from '@apps/psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  LIST_SUCCESS_ROLE: 'MODULES/ENTITIES/PSA/EXTENDED_ITEM/LIST_SUCCESS_ROLE',
  LIST_SUCCESS_PROJECT:
    'MODULES/ENTITIES/PSA/EXTENDED_ITEM/LIST_SUCCESS_PROJECT',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/EXTENDED_ITEM/INIT_SUCCESS',
};

const listSuccessRole = (body: PsaExtendedItemList) => ({
  type: ACTIONS.LIST_SUCCESS_ROLE,
  payload: body,
});
const listSuccessProject = (body: PsaExtendedItemList) => ({
  type: ACTIONS.LIST_SUCCESS_PROJECT,
  payload: body,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});

export const actions = {
  list:
    (companyId: string, objectType: string) =>
    (dispatch: AppDispatch): void | any =>
      searchExtendedItem(companyId, objectType)
        .then((res: PsaExtendedItemList) => {
          const modified = res.map((eI) => {
            if (eI.picklistLabel) {
              return {
                ...eI,
                picklistLabel: eI.picklistLabel.replace(/\n/g, '\\n'),
                picklistValue: eI.picklistValue.replace(/\n/g, '\\n'),
              };
            }
            return eI;
          });
          if (objectType === 'Role') {
            dispatch(listSuccessRole(modified.sort(sortByOrder)));
          }
          if (objectType === 'Project') {
            dispatch(listSuccessProject(modified.sort(sortByOrder)));
          }
        })
        .catch((err) => {
          throw err;
        }),

  initialize:
    () =>
    (dispatch: AppDispatch): Promise<PsaExtendedItemList> =>
      dispatch(initialize()),
};

const initialState = {
  project: initialPsaExtendedItemList,
  role: initialPsaExtendedItemList,
};

type State = {
  project: PsaExtendedItemList;
  role: PsaExtendedItemList;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS_PROJECT:
      return {
        ...state,
        project: action.payload,
      };
    case ACTIONS.LIST_SUCCESS_ROLE:
      return {
        ...state,
        role: action.payload,
      };
    case ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
