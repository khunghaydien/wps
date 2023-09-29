import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_VALID_DATE, FIELD_AUTOSUGGEST_TEXT } =
  fieldType;
const { DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
  },
  {
    key: 'baseCurrencyCode',
    type: FIELD_HIDDEN,
  },
  {
    key: 'baseCurrencyName',
    msgkey: 'Exp_Lbl_BaseCurrency',
    type: FIELD_TEXT,
  },
  {
    key: 'currencyId',
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
  },
  {
    key: 'currencyPair',
    props: 'currencyPair',
    path: '/exp/exchange-rate/currency-pair/get',
    type: FIELD_HIDDEN,
  },
  {
    key: 'currencyPairLabel',
    msgkey: 'Admin_Lbl_CurrencyPair',
    type: FIELD_TEXT,
  },
  {
    key: 'rate',
    msgkey: 'Exp_Lbl_ExchangeRate',
    type: FIELD_TEXT,
    charType: 'numeric',
    isRequired: true,
  },
  { key: 'reverseRate', type: FIELD_HIDDEN },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    isRequired: true,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'validDateTo',
    type: FIELD_HIDDEN,
    msgkey: 'Admin_Lbl_ValidDateTo',
    isRequired: true,
  },
];

const configList: ConfigListMap = { base };

export default configList;
