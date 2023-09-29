import {
  LayoutItem,
  RelatedItem,
} from '@apps/domain/models/customRequest/types';

const ACTIONS = {
  SET_SUCCESS: 'MODULES/UI/CUSTOM_REQUEST/LAYOUT_CONFIG/SET_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/UI/CUSTOM_REQUEST/LAYOUT_CONFIG/CLEAR_SUCCESS',
} as const;

type LayoutConfig = {
  config: LayoutItem[];
  // to determine if file attachment data should be fetched
  // and file section visibility in edit dialog
  relatedList: RelatedItem[];
  recordTypeId: string;
};

type SetSuccess = {
  type: typeof ACTIONS.SET_SUCCESS;
  payload: LayoutConfig;
};

type ClearSuccess = {
  type: typeof ACTIONS.CLEAR_SUCCESS;
};

export const actions = {
  set: (
    config: LayoutItem[],
    relatedList: RelatedItem[],
    recordTypeId: string
  ) => ({
    type: ACTIONS.SET_SUCCESS,
    payload: { config, relatedList, recordTypeId },
  }),
  clear: () => ({
    type: ACTIONS.CLEAR_SUCCESS,
  }),
};

const initialState = [];

export default (
  state = initialState,
  action: SetSuccess | ClearSuccess
): LayoutConfig[] => {
  switch (action.type) {
    case ACTIONS.SET_SUCCESS:
      return [...state, action.payload];
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
