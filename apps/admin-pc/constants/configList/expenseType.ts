import {
  JCT_REGISTRATION_NUMBER_TYPE,
  MERCHANT_TYPE,
  RECEIPT_TYPE,
} from '../../../domain/models/exp/Record';

import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import AmountOptionListComponent from '../../components/AmountList/AmountOptionListComponent';
import ExpenseTypeGridComponent from '../../components/ExpenseTypeLinkConfig/ExpenseTypeGridComponent';
import ExpTypeLinkConfigComponent from '../../components/ExpenseTypeLinkConfig/ExpTypeLinkConfigComponent';
import TaxTypeConfigComponent from '../../presentational-components/ExpenseType/TaxTypeConfigComponent';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';
import { getExpTypeAttributeList } from './expTypeAttribute';
import { getExtendedItemList } from './extendedItemSetting';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_VALID_DATE,
  FIELD_SELECT,
  FIELD_CUSTOM,
  FIELD_AUTOSUGGEST_TEXT,
  FIELD_TEXTAREA,
  FIELD_CHECKBOX,
} = fieldType;
const { SIZE_SMALL } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const receiptSettingsOptions = [
  {
    msgkey: 'Exp_Sel_ReceiptType_Optional',
    value: RECEIPT_TYPE.Optional,
  },
  {
    msgkey: 'Exp_Sel_ReceiptType_Required',
    value: RECEIPT_TYPE.Required,
  },
  {
    msgkey: 'Exp_Sel_ReceiptType_NotUsed',
    value: RECEIPT_TYPE.NotUsed,
  },
];

const merchantSettingsOptions = [
  {
    msgkey: 'Exp_Sel_ReceiptType_Optional',
    value: MERCHANT_TYPE.Optional,
  },
  {
    msgkey: 'Exp_Sel_ReceiptType_Required',
    value: MERCHANT_TYPE.Required,
  },
  {
    msgkey: 'Exp_Sel_ReceiptType_NotUsed',
    value: MERCHANT_TYPE.NotUsed,
  },
];

const jctRegistrationNumberSettingsOptions = [
  {
    msgkey: 'Exp_Sel_ReceiptType_Optional',
    value: JCT_REGISTRATION_NUMBER_TYPE.Optional,
  },
  {
    msgkey: 'Exp_Sel_ReceiptType_Required',
    value: JCT_REGISTRATION_NUMBER_TYPE.Required,
  },
  {
    msgkey: 'Exp_Sel_ReceiptType_NotUsed',
    value: JCT_REGISTRATION_NUMBER_TYPE.NotUsed,
  },
];

const isTransitJPRecord = (recordType) =>
  ['TransitJorudanJP', 'TransportICCardJP'].includes(recordType);

const canUseForeignCurrency = (baseValueGetter) => {
  const recordType = baseValueGetter('recordType');
  return !isTransitJPRecord(recordType);
};

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
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
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    display: DISPLAY_DETAIL,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'description_L0',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_ExpTypeDescription',
  },
  {
    key: 'description_L1',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'description_L2',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'parentGroupId',
    msgkey: 'Admin_Lbl_ParentExpTypeGroup',
    props: 'expTypeGroupId',
    dependent: 'parentGroup',
    type: FIELD_SELECT,
    action: 'searchparentExpTypeGroup',
    help: 'Admin_Help_ExpTypeParent',
  },
  {
    key: 'order',
    msgkey: 'Admin_Lbl_Order',
    type: FIELD_TEXT,
    size: SIZE_SMALL,
    charType: 'numeric',
    help: 'Admin_Help_ExpTypeOrder',
  },
  {
    key: 'recordType',
    msgkey: 'Exp_Lbl_RecordType',
    props: 'recordType',
    type: FIELD_SELECT,
    multiLanguageValue: true,
    isRequired: true,
    help: 'Admin_Help_ExpTypeRecordType',
  },
  {
    key: 'expenseToExpenseConfig',
    class: 'admin-pc-contents-detail-pane__body__item-list__exp_config',
    msgkey: 'Admin_Lbl_ExpenseTypeConfig',
    type: FIELD_CUSTOM,
    useFunction: 'useExpense',
    Component: ExpTypeLinkConfigComponent,
    condition: (baseValueGetter) =>
      baseValueGetter('recordType') === 'HotelFee',
    display: DISPLAY_DETAIL,
  },
  {
    key: 'expTypeChildIds',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_expense_type_grid',
    msgkey: 'Admin_Lbl_ExpenseTypeConfig',
    type: FIELD_CUSTOM,
    useFunction: 'useExpense',
    Component: ExpenseTypeGridComponent,
    condition: (baseValueGetter) =>
      baseValueGetter('recordType') === 'HotelFee',
    display: DISPLAY_DETAIL,
  },
  {
    key: 'foreignCurrencyUsage',
    msgkey: 'Admin_Lbl_UseForeignCurrency',
    props: 'foreignCurrencyUsage',
    multiLanguageValue: true,
    type: FIELD_SELECT,
    isRequired: true,
    condition: (baseValueGetter) => canUseForeignCurrency(baseValueGetter),
  },
  {
    key: 'fixedForeignCurrencyId',
    msgkey: 'Admin_Lbl_CurrencyCode',
    props: 'currencyId',
    isRequired: true,
    display: DISPLAY_DETAIL,
    type: FIELD_AUTOSUGGEST_TEXT,
    action: 'searchCurrency',
    autoSuggest: {
      value: 'id',
      label: 'name',
      buildLabel: (item) => `${item.isoCurrencyCode} - ${item.name}`,
      suggestionKey: ['id', 'name', 'isoCurrencyCode'],
    },
    help: 'Admin_Help_AutoSuggest',
    condition: (baseValueGetter) =>
      baseValueGetter('foreignCurrencyUsage') === 'FIXED' &&
      canUseForeignCurrency(baseValueGetter),
  },
  {
    key: 'fixedAllowanceSingleAmount',
    msgkey: 'Admin_Lbl_Amount',
    type: FIELD_TEXT,
    charType: 'numeric',
    isRequired: true,
    help: 'Admin_Help_FixedAmountSingle',
    condition: (baseValueGetter) =>
      baseValueGetter('recordType') === 'FixedAllowanceSingle',
  },
  {
    key: 'fixedAllowanceOptionList',
    msgkey: 'Admin_Lbl_AmountList',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_fixed_allowance_option_list',
    type: FIELD_CUSTOM,
    Component: AmountOptionListComponent,
    display: DISPLAY_DETAIL,
    isRequired: true,
    help: 'Admin_Help_FixedAmountMultiple',
    condition: (baseValueGetter) =>
      baseValueGetter('recordType') === 'FixedAllowanceMulti',
  },
  {
    key: 'taxTypeIdList',
    class: 'exp-tax-type-config',
    msgkey: 'Admin_Lbl_ExpTaxType',
    type: FIELD_CUSTOM,
    display: DISPLAY_DETAIL,
    isRequired: true,
    help: 'Admin_Help_ExpTypeTaxType',
    useFunction: 'useExpense',
    Component: TaxTypeConfigComponent,
    condition: (baseValueGetter) => {
      return (
        baseValueGetter('foreignCurrencyUsage') === 'NOT_USED' ||
        baseValueGetter('recordType') === 'TransitJorudanJP' ||
        baseValueGetter('recordType') === 'TransportICCardJP'
      );
    },
  },
  {
    key: 'fileAttachment',
    msgkey: 'Exp_Lbl_ReceiptSetting',
    options: receiptSettingsOptions,
    type: FIELD_SELECT,
    multiLanguageValue: true,
    isRequired: true,
    condition: (baseValueGetter) => {
      const recordType = baseValueGetter('recordType');
      return !isTransitJPRecord(recordType);
    },
  },
  {
    key: 'merchant',
    msgkey: 'Exp_Clbl_Merchant',
    options: merchantSettingsOptions,
    type: FIELD_SELECT,
    multiLanguageValue: true,
    isRequired: true,
    condition: (baseValueGetter) => {
      const recordType = baseValueGetter('recordType');
      return !isTransitJPRecord(recordType);
    },
    help: 'Admin_Help_ExpTypeMerchant',
  },
  {
    key: 'jctRegistrationNumberUsage',
    msgkey: 'Exp_Lbl_JCTInvoiceAvailability',
    defaultValue: JCT_REGISTRATION_NUMBER_TYPE.NotUsed,
    options: jctRegistrationNumberSettingsOptions,
    type: FIELD_SELECT,
    multiLanguageValue: true,
  },
  {
    key: 'displayJctNumberInput',
    msgkey: 'Exp_Lbl_DisplayJctRegistrationNumberInput',
    type: FIELD_CHECKBOX,
    condition: (baseValueGetter) => {
      const jctRegistrationNumberSetting = baseValueGetter(
        'jctRegistrationNumberUsage'
      );
      return (
        jctRegistrationNumberSetting ===
          JCT_REGISTRATION_NUMBER_TYPE.Optional ||
        jctRegistrationNumberSetting === JCT_REGISTRATION_NUMBER_TYPE.Required
      );
    },
  },
  {
    key: 'debitAccountName',
    msgkey: 'Admin_Lbl_DebitAccountName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'debitAccountCode',
    msgkey: 'Admin_Lbl_DebitAccountCode',
    type: FIELD_TEXT,
    size: SIZE_SMALL,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  {
    key: 'debitSubAccountName',
    msgkey: 'Admin_Lbl_DebitSubAccountName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'debitSubAccountCode',
    msgkey: 'Admin_Lbl_DebitSubAccountCode',
    type: FIELD_TEXT,
    size: SIZE_SMALL,
    display: DISPLAY_DETAIL,
  },
  getExtendedItemList('Text'),
  getExtendedItemList('Picklist'),
  getExtendedItemList('Date'),
  getExtendedItemList('Lookup'),
  getExpTypeAttributeList(),
  { key: 'companyId', type: FIELD_HIDDEN },
  { key: 'useCompanyTaxMaster', type: FIELD_HIDDEN },
  {
    key: 'usage',
    type: FIELD_HIDDEN,
    defaultValue: 'Normal',
  },
];

const configList: ConfigListMap = { base };

export default configList;
