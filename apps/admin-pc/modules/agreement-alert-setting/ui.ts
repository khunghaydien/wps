import {
  create as baseCreate,
  del as baseDelete,
  update as baseUpdate,
} from '../../actions/base';

const CREATE_AGREEMENT_ALERT_SETTING = 'CREATE_AGREEMENT_ALERT_SETTING';

const DELETE_AGREEMENT_ALERT_SETTING = 'DELETE_AGREEMENT_ALERT_SETTING';

const UPDATE_AGREEMENT_ALERT_SETTING = 'UPDATE_AGREEMENT_ALERT_SETTING';

const CREATE_AGREEMENT_ALERT_SETTING_ERROR =
  'CREATE_AGREEMENT_ALERT_SETTING_ERROR';

const DELETE_AGREEMENT_ALERT_SETTING_ERROR =
  'DELETE_AGREEMENT_ALERT_SETTING_ERROR';

const UPDATE_AGREEMENT_ALERT_SETTING_ERROR =
  'UPDATE_AGREEMENT_ALERT_SETTING_ERROR';

type CreateAgreementAlertSettingAction = {
  type: 'CREATE_AGREEMENT_ALERT_SETTING';
};

type CreateAgreementAlertSettingErrorAction = {
  type: 'CREATE_AGREEMENT_ALERT_SETTING_ERROR';
};

export const createAgreementAlertSetting = (param: {
  /* eslint-disable camelcase */
  name_L0: string;
  /* eslint-disable camelcase */
  name_L1: string | null | undefined;
  /* eslint-disable camelcase */
  name_L2: string | null | undefined;
  code: string;
  companyId: string;
  validDateFrom: string | null | undefined;
  validDateTo: string | null | undefined;
  monthlyAgreementHourWarning1: number;
  monthlyAgreementHourWarning2: number;
  monthlyAgreementHourLimit: number;
  monthlyAgreementHourWarningSpecial1: number;
  monthlyAgreementHourWarningSpecial2: number;
  monthlyAgreementHourLimitSpecial: number;
}) =>
  baseCreate(
    'att/agreement-alert-setting',
    param,
    CREATE_AGREEMENT_ALERT_SETTING,
    CREATE_AGREEMENT_ALERT_SETTING_ERROR
  );

type DeleteAgreementAlertSettingAction = {
  type: 'DELETE_AGREEMENT_ALERT_SETTING';
};

type DeleteAgreementAlertSettingErrorAction = {
  type: 'DELETE_AGREEMENT_ALERT_SETTING_ERROR';
};

export const deleteAgreementAlertSetting = (param: { id: string }) =>
  baseDelete(
    'att/agreement-alert-setting',
    param,
    DELETE_AGREEMENT_ALERT_SETTING,
    DELETE_AGREEMENT_ALERT_SETTING_ERROR
  );

type UpdateAgreementAlertSettingAction = {
  type: 'UPDATE_AGREEMENT_ALERT_SETTING';
};

type UpdateAgreementAlertSettingErrorAction = {
  type: 'UPDATE_AGREEMENT_ALERT_SETTING_ERROR';
};

export const updateAgreementAlertSetting = (param: { id: string }) =>
  baseUpdate(
    'att/agreement-alert-setting',
    param,
    UPDATE_AGREEMENT_ALERT_SETTING,
    UPDATE_AGREEMENT_ALERT_SETTING_ERROR
  );

type Action =
  | CreateAgreementAlertSettingAction
  | DeleteAgreementAlertSettingAction
  | UpdateAgreementAlertSettingAction
  | CreateAgreementAlertSettingErrorAction
  | DeleteAgreementAlertSettingErrorAction
  | UpdateAgreementAlertSettingErrorAction;

type State = Record<string, unknown>;

const initialState: State = {};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    default:
      return state;
  }
};
