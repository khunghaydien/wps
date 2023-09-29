import { Reducer } from 'redux';

import { pageView } from '@apps/domain/models/customRequest/consts';
import { PageViewType } from '@apps/domain/models/customRequest/types';

const ACTIONS = {
  SET_PAGE_VIEW: 'MODULES/UI/SET_PAGE_VIEW',
};

export const actions = {
  setView: (view: PageViewType) => ({
    type: ACTIONS.SET_PAGE_VIEW,
    payload: view,
  }),
};

const initialState = pageView.List;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_PAGE_VIEW:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<PageViewType, any>;
