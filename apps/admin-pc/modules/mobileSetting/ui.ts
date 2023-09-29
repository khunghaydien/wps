import { Reducer } from 'redux';

import { catchApiError, withLoading } from '../../../commons/actions/app';
import { SELECT_TAB } from '../../../commons/actions/tab';

import {
  MobileSetting,
  save as saveMobileSetting,
} from '../../models/mobile-setting/MobileSetting';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../base/menu-pane/ui';

type State = MobileSetting | null | undefined;

const initialState: State = null;

export const ACTIONS = {
  START_EDITING: 'ADMIN/MOBILE_SETTING/UI/START_EDITING',
  CANCEL_EDITING: 'ADMIN/MOBILE_SETTING/UI/CANCEL_EDITING',
  UNSET: 'ADMIN/MOBILE_SETTING/UI/UNSET',
  UPDATE: 'ADMIN/MOBILE_SETTING/UI/UPDATE',
};

export const actions = {
  unset: () => {
    return {
      type: ACTIONS.UNSET,
    };
  },
  startEditing: (mobileSetting: MobileSetting) => {
    return {
      type: ACTIONS.START_EDITING,
      payload: mobileSetting,
    };
  },
  cancelEditing: () => {
    return {
      type: ACTIONS.CANCEL_EDITING,
    };
  },
  update: (key: string, value: any) => ({
    type: ACTIONS.UPDATE,
    payload: {
      key,
      value,
    },
  }),
  save:
    (companyId: string, mobileSetting: MobileSetting, onSuccess: () => any) =>
    (dispatch: AppDispatch) => {
      return dispatch(
        withLoading(
          () => saveMobileSetting(companyId, mobileSetting),
          onSuccess,
          () => dispatch(actions.unset())
        )
      ).catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
    },
};

export default ((state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.START_EDITING:
      return action.payload;

    case ACTIONS.UPDATE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case ACTIONS.UNSET:
    case ACTIONS.CANCEL_EDITING:
    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
