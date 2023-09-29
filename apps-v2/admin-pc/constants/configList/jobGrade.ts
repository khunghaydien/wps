import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL, DISPLAY_BOTH } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'code',
    class: 'psa__job__code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
  },
  {
    key: 'name',
    class: 'psa__job__name',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'name_L0',
    class: 'psa__job__name--us',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  {
    key: 'name_L1',
    class: 'psa__job__name--ja',
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
    key: 'grade',
    class: 'psa__job__grade',
    msgkey: 'Admin_Lbl_JobGrade',
    type: FIELD_HIDDEN,
    charType: 'numeric_0-99',
  },
  {
    key: 'currencyCode',
    msgkey: 'Psa_Lbl_BaseCurrency',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    readOnly: true,
  },
  {
    key: 'costRate',
    class: 'psa__job__cost-rate',
    msgkey: 'Admin_Lbl_CostRateHour',
    type: FIELD_TEXT,
    display: DISPLAY_BOTH,
    charType: 'numeric',
  },
  {
    key: 'billingRate',
    class: 'psa__job__billing-rate',
    msgkey: 'Admin_Lbl_BillingRateHour',
    type: FIELD_TEXT,
    display: DISPLAY_BOTH,
    charType: 'numeric',
  },
];

const configList: ConfigListMap = { base };

export default configList;
