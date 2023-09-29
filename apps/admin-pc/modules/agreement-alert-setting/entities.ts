import { AgreementAlertSetting } from '../../models/agreement-alert-setting/types';

import { search as baseSearch } from '../../actions/base';

export const SEARCH_AGREEMENT_ALERT_SETTING = 'SEARCH_AGREEMENT_ALERT_SETTING';

const SEARCH_AGREEMENT_ALERT_SETTING_ERROR =
  'SEARCH_AGREEMENT_ALERT_SETTING_ERROR';

type SearchAgreementAlertSettingAction = {
  type: 'SEARCH_AGREEMENT_ALERT_SETTING';
  payload: AgreementAlertSetting[];
};

type SearchAgreementAlertSettingErrorAction = {
  type: 'SEARCH_AGREEMENT_ALERT_SETTING_ERROR';
};

export const searchAgreementAlertSetting = (
  param:
    | {
        companyId: string;
      }
    | {
        id: string;
      }
) =>
  baseSearch(
    'att/agreement-alert-setting',
    param,
    SEARCH_AGREEMENT_ALERT_SETTING,
    SEARCH_AGREEMENT_ALERT_SETTING_ERROR
  );

type Action =
  | SearchAgreementAlertSettingAction
  | SearchAgreementAlertSettingErrorAction;

type State = AgreementAlertSetting[];

const initialState: State = [];

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SEARCH_AGREEMENT_ALERT_SETTING:
      return (action as SearchAgreementAlertSettingAction).payload;

    default:
      return state;
  }
};
