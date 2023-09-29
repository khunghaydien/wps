import cloneDeep from 'lodash/cloneDeep';

import { FETCH_FEATURE_ACCESS_LIST } from '@admin-pc-v2/actions/featureAccess';

const initialState = [];

type FeatureAccessListItem = {
  id: string;
  code: string;
  name: string;
  name_L0?: string;
  name_L1?: string;
  name_L2?: string;
  companyId: string;
  product: string;
  isRemoved: boolean;
};

type FeatureAccessList = FeatureAccessListItem[];

export type State = FeatureAccessList;

const ACTIONS = {
  SET_LIST_DETAIL:
    'ADMIN-PC-V2/MODULES/FEATURE_ACCESS/ENTITIES/LIST/SET_LIST_DETAIL',
};

export const action = {
  setListDetail: (record: FeatureAccessListItem) => ({
    type: ACTIONS.SET_LIST_DETAIL,
    payload: record,
  }),
};

export default function featureAccessReducer(
  state: State = initialState,
  action
) {
  switch (action.type) {
    case FETCH_FEATURE_ACCESS_LIST:
      return action.payload;
    case ACTIONS.SET_LIST_DETAIL: {
      const fetchedItem = action.payload;
      const list = cloneDeep(state);
      const idx = state.findIndex((row) => row.id === fetchedItem.id);
      list[idx] = fetchedItem;
      return list;
    }
    default:
      return state;
  }
}
