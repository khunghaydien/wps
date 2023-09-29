import { paymentDueDateSettingOptions } from '../../../domain/models/exp/Vendor';

import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_CHECKBOX,
  FIELD_AUTOSUGGEST_TEXT,
  FIELD_SELECT,
  FIELD_TEXTAREA,
} = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
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
    key: 'active',
    msgkey: 'Admin_Lbl_Active',
    label: 'Admin_Msg_Active',
    type: FIELD_CHECKBOX,
  },
  {
    key: 'isJctQualifiedInvoiceIssuer',
    msgkey: 'Admin_Lbl_JCTQualifiedInvoiceIssuer',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'jctRegistrationNumber',
    msgkey: 'Exp_Clbl_JctRegistrationNumber',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 14,
  },
  {
    key: 'paymentDueDateUsage',
    msgkey: 'Exp_Clbl_PaymentDate',
    options: paymentDueDateSettingOptions,
    type: FIELD_SELECT,
    isRequired: true,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'paymentTerm',
    msgkey: 'Exp_Lbl_PaymentTerm',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'paymentTermCode',
    msgkey: 'Exp_Lbl_PaymentTermCode',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'isWithholdingTax',
    msgkey: 'Exp_Lbl_WithholdingTax',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'bankAccountType',
    msgkey: 'Exp_Lbl_BankAccountType',
    props: 'bankAccountType',
    type: FIELD_SELECT,
    multiLanguageValue: true,
  },
  {
    key: 'bankAccountNumber',
    msgkey: 'Exp_Lbl_BankAccountNumber',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'bankCode',
    msgkey: 'Exp_Lbl_BankCode',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'bankName',
    msgkey: 'Exp_Lbl_BankName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'branchCode',
    msgkey: 'Exp_Lbl_BranchCode',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'branchName',
    msgkey: 'Exp_Lbl_BranchName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'branchAddress',
    msgkey: 'Exp_Lbl_BranchAddress',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'payeeName',
    msgkey: 'Exp_Lbl_PayeeName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'currencyCode',
    msgkey: 'Exp_Lbl_BankCurrency',
    type: FIELD_AUTOSUGGEST_TEXT,
    props: 'isoCurrencyCode',
    autoSuggest: {
      value: 'value',
      label: 'label',
      buildLabel: (item) => `${item.label}`,
      suggestionKey: ['value', 'label'],
    },
    help: 'Admin_Help_AutoSuggest',
    action: 'searchIsoCurrencyCode',
    display: DISPLAY_DETAIL,
  },
  {
    key: 'swiftCode',
    msgkey: 'Exp_Lbl_SwiftCode',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'correspondentBankName',
    msgkey: 'Exp_Lbl_CorrespondentBankBankName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'correspondentBranchName',
    msgkey: 'Exp_Lbl_CorrespondentBankBranchName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'correspondentBankAddress',
    msgkey: 'Exp_Lbl_CorrespondentBankAddress',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'correspondentSwiftCode',
    msgkey: 'Exp_Lbl_CorrespondentBankSwiftCode',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'country',
    msgkey: 'Exp_Lbl_CountryCode',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'zipCode',
    msgkey: 'Exp_Lbl_ZipCode',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'address',
    msgkey: 'Exp_Lbl_Address',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
];

const configList: ConfigListMap = { base };

export default configList;
