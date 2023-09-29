import { FINANCE_TYPE } from '../../../domain/models/psa/FinanceCategory';

import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import FinancePresetContainer from '../../containers/FinancePresetContainer';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_CUSTOM,
  FIELD_TEXTAREA,
  FIELD_SELECT,
  FIELD_NUMBER,
} = fieldType;
const { SIZE_SMALL } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const financeTypeOptions = [
  {
    msgkey: 'Psa_Lbl_FinanceTypeRevenue',
    value: FINANCE_TYPE.Revenue,
  },
  {
    msgkey: 'Psa_Lbl_FinanceTypeCost',
    value: FINANCE_TYPE.Cost,
  },
];

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'financeType',
    msgkey: 'Admin_Lbl_FinanceType',
    type: FIELD_SELECT,
    props: 'financeType',
    options: financeTypeOptions,
    multiLanguageValue: true,
    isRequired: true,
  },
  {
    key: 'recordType',
    msgkey: 'Exp_Lbl_RecordType',
    type: FIELD_SELECT,
    multiLanguageValue: true,
    isRequired: true,
    help: 'Psa_Msg_RecordTypeHint',
  },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
  },
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
    key: 'description_L0',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
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
    key: 'order',
    msgkey: 'Psa_Lbl_OrderNumber',
    props: 'order',
    type: FIELD_NUMBER,
    size: SIZE_SMALL,
    charType: 'numeric',
    isRequired: true,
  },
  {
    key: 'presetItems',
    class: 'admin-pc__finance-preset-items',
    msgkey: 'Psa_Lbl_Default_Details',
    type: FIELD_CUSTOM,
    Component: FinancePresetContainer,
    display: DISPLAY_DETAIL,
    help: 'Psa_Msg_MaxDetailItem',
  },
];

const configList: ConfigListMap = { base };

export default configList;
