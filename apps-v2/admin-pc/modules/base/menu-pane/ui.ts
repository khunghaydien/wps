import {
  GET_USER_SETTING,
  GetUserSettingSuccessAction,
} from '../../../../commons/actions/userSetting';

export const CHANGE_COMPANY = 'MODULES/BASE/MENU_PANE/UI/CHANGE_COMPANY';
export const SELECT_MENU_ITEM = 'MODULES/BASE/MENU_PANE/UI/SELECT_MENU_ITEM';

export type ChangeCompanyAction = {
  type: 'MODULES/BASE/MENU_PANE/UI/CHANGE_COMPANY';
  payload: string;
};

export const changeCompany = (newCompanyId: string): ChangeCompanyAction => ({
  type: CHANGE_COMPANY,
  payload: newCompanyId,
});

export type SelectMenuItemAction = {
  type: 'MODULES/BASE/MENU_PANE/UI/SELECT_MENU_ITEM';
  payload: string;
};

export const selectMenuItem = (
  newMenuItemKey: string
): SelectMenuItemAction => ({
  type: SELECT_MENU_ITEM,
  payload: newMenuItemKey,
});

export type State = {
  readonly targetCompanyId: string | null | undefined;
  readonly selectedMenuItemKey: string | null | undefined;
};

export type Action = ChangeCompanyAction | SelectMenuItemAction;

export const initialState: State = {
  targetCompanyId: null,
  selectedMenuItemKey: null,
};

export default (
  state: State = initialState,
  action: Action | GetUserSettingSuccessAction
): State => {
  switch (action.type) {
    case CHANGE_COMPANY:
      return {
        ...state,
        targetCompanyId: (action as ChangeCompanyAction).payload,
      };
    case SELECT_MENU_ITEM:
      return {
        ...state,
        selectedMenuItemKey: (action as SelectMenuItemAction).payload,
      };

    case GET_USER_SETTING:
      return {
        ...state,
        targetCompanyId: (action as GetUserSettingSuccessAction).payload
          .companyId,
      };

    default:
      return state;
  }
};
