import displayType from '@admin-pc/constants/displayType';
import fieldType from '@admin-pc/constants/fieldType';

import { CARD_ASSOCIATION, ISSUER } from '@apps/domain/models/exp/CreditCard';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

import CreditCardAssignAreaContainer from '../../containers/CreditCardContainer/CreditCardAssignAreaContainer';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_TEXTAREA,
  FIELD_SELECT,
  FIELD_CHECKBOX,
  FIELD_CUSTOM,
} = fieldType;
const { DISPLAY_BOTH, DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const cardAssociationOptions = [
  {
    msgkey: 'Exp_Sel_CardAssociation_Master',
    value: CARD_ASSOCIATION.Master,
  },
  {
    msgkey: 'Exp_Sel_CardAssociation_Visa',
    value: CARD_ASSOCIATION.Visa,
  },
];

const issuerIdOptions = [
  {
    msgkey: 'Exp_Sel_Issuer_SMBC',
    value: ISSUER.SMBC,
  },
  {
    msgkey: 'Exp_Sel_Issuer_SAISON',
    value: ISSUER.SAISON,
  },
  {
    msgkey: 'Exp_Sel_Issuer_NICOS',
    value: ISSUER.NICOS,
  },
];

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN },
  {
    key: 'name',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'name_L0',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'cardAssociation',
    msgkey: 'Admin_Lbl_CardAssociation',
    options: cardAssociationOptions,
    type: FIELD_SELECT,
    multiLanguageValue: true,
    display: DISPLAY_BOTH,
    isRequired: true,
  },
  {
    key: 'issuerId',
    msgkey: 'Admin_Lbl_IssuerId',
    options: issuerIdOptions,
    type: FIELD_SELECT,
    multiLanguageValue: true,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  {
    key: 'cardNumber',
    msgkey: 'Admin_Lbl_CardNumber',
    type: FIELD_TEXT,
    display: DISPLAY_BOTH,
    isRequired: true,
  },
  {
    key: 'cardEmployeeId',
    msgkey: 'Admin_Lbl_CardEmployeeId',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
    help: 'Admin_Help_CardEmployeeId',
  },
  {
    key: 'reimbursementFlag',
    msgkey: 'Admin_Lbl_CardReimbursementFlag',
    label: '',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'reimbursementFlag',
    msgkey: 'Admin_Lbl_CardReimbursementFlag',
    label: 'Admin_Lbl_CardReimbursementFlagTrue',
    type: FIELD_CHECKBOX,
    display: DISPLAY_LIST,
    defaultValue: false,
  },
  {
    key: 'cardholderName',
    msgkey: 'Admin_Lbl_Cardholder',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
    readOnly: true,
  },
  {
    key: 'remarks',
    msgkey: 'Admin_Lbl_Remarks',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'creidtCardAssignArea',
    type: FIELD_CUSTOM,
    Component: CreditCardAssignAreaContainer,
    display: DISPLAY_DETAIL,
    noLabel: true,
    enableMode: 'edit',
  },
];

const configList: ConfigListMap = { base };

export default configList;
