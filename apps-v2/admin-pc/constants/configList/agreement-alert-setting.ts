import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_VALID_DATE, FIELD_NUMBER } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;
const { SIZE_SMALL } = fieldSize;

const base: ConfigList = [
  {
    key: 'id',
    type: FIELD_HIDDEN,
  },
  {
    key: 'companyId',
    type: FIELD_HIDDEN,
    isRequired: true,
  },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
  },
  {
    key: 'name',
    display: DISPLAY_LIST,
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
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
    display: DISPLAY_DETAIL,
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
  },
  {
    key: 'name_L2',
    display: DISPLAY_DETAIL,
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
  },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    section: 'OvertimeWorkHours',
    msgkey: 'Admin_Lbl_OvertimeWorkHoursAndSpecialProvisions',
    isExpandable: true,
    configList: [
      {
        key: 'monthlyAgreementHourLimit',
        display: DISPLAY_DETAIL,
        msgkey: 'Admin_Lbl_MonthlyAgreementHourLimit',
        type: FIELD_NUMBER,
        size: SIZE_SMALL,
        min: 0,
        step: 1,
        isRequired: true,
      },
      {
        key: 'monthlyAgreementHourLimitSpecial',
        display: DISPLAY_DETAIL,
        msgkey: 'Admin_Lbl_MonthlyAgreementHourLimitSpecial',
        type: FIELD_NUMBER,
        size: SIZE_SMALL,
        min: 0,
        step: 1,
      },
      {
        key: 'monthlyAgreementHourWarning1',
        display: DISPLAY_DETAIL,
        msgkey: 'Admin_Lbl_MonthlyAgreementHourWarning1',
        type: FIELD_NUMBER,
        size: SIZE_SMALL,
        min: 0,
        step: 1,
      },
      {
        key: 'monthlyAgreementHourWarning2',
        display: DISPLAY_DETAIL,
        msgkey: 'Admin_Lbl_MonthlyAgreementHourWarning2',
        type: FIELD_NUMBER,
        size: SIZE_SMALL,
        min: 0,
        step: 1,
      },
      {
        key: 'monthlyAgreementHourWarningSpecial1',
        display: DISPLAY_DETAIL,
        msgkey: 'Admin_Lbl_MonthlyAgreementHourWarningSpecial1',
        type: FIELD_NUMBER,
        size: SIZE_SMALL,
        min: 0,
        step: 1,
      },
      {
        key: 'monthlyAgreementHourWarningSpecial2',
        display: DISPLAY_DETAIL,
        msgkey: 'Admin_Lbl_MonthlyAgreementHourWarningSpecial2',
        type: FIELD_NUMBER,
        size: SIZE_SMALL,
        min: 0,
        step: 1,
      },
    ],
  },
];

export default {
  base,
} as ConfigListMap;
