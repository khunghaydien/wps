import { Reducer } from 'redux';

import { catchApiError, withLoading } from '../../../commons/actions/app';
import { SELECT_TAB } from '../../../commons/actions/tab';

import {
  fetch,
  MobileSetting,
} from '../../models/mobile-setting/MobileSetting';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../base/menu-pane/ui';

type State = MobileSetting;

const ACTIONS = {
  SET: 'ADMIN/MOBILE_SETTING/ENTITIES/SET',
  UNSET: 'ADMIN/MOBILE_SETTING/ENTITIES/UNSET',
};

const setMobileSetting = (mobileSetting: MobileSetting) => ({
  type: ACTIONS.SET,
  payload: mobileSetting,
});

export const actions = {
  clear: () => ({
    type: ACTIONS.UNSET,
  }),

  fetch: (companyId: string) => (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        () => fetch({ companyId }),
        (result: MobileSetting) => dispatch(setMobileSetting(result))
      )
    ).catch((err) => dispatch(catchApiError(err, { isContinuable: true }))),
};

const initialState = {
  requireLocationAtMobileStamp: false,
};

export default ((state: State = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;

    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
    case ACTIONS.UNSET:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
