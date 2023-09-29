import { ConfigList, ConfigListMap } from '@apps/admin-pc/utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_CHECKBOX,
  FIELD_NUMBER,
  FIELD_TEXTAREA,
} = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'code',
    class: 'psa_work-scheme__code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
  },
  {
    key: 'name',
    class: 'psa_work-scheme__name',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'name_L0',
    class: 'psa_work-scheme__name--us',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  {
    key: 'name_L1',
    class: 'psa_work-scheme__name--ja',
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
    key: 'workingDayMON',
    class: 'psa__work-scheme__working-day-mon',
    msgkey: 'Admin_Lbl_WorkingDayMon',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    defaultValue: true,
  },
  {
    key: 'workingDayTUE',
    class: 'psa__work-scheme__working-day-tue',
    msgkey: 'Admin_Lbl_WorkingDayTue',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    defaultValue: true,
  },
  {
    key: 'workingDayWED',
    class: 'psa__work-scheme__working-day-wed',
    msgkey: 'Admin_Lbl_WorkingDayWed',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    defaultValue: true,
  },
  {
    key: 'workingDayTHU',
    class: 'psa__work-scheme__working-day-thu',
    msgkey: 'Admin_Lbl_WorkingDayThu',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    defaultValue: true,
  },
  {
    key: 'workingDayFRI',
    class: 'psa__work-scheme__working-day-fri',
    msgkey: 'Admin_Lbl_WorkingDayFri',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    defaultValue: true,
  },
  {
    key: 'workingDaySAT',
    class: 'psa__work-scheme__working-day-sat',
    msgkey: 'Admin_Lbl_WorkingDaySat',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'workingDaySUN',
    class: 'psa__work-scheme__working-day-sun',
    msgkey: 'Admin_Lbl_WorkingDaySun',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'workTimePerDay',
    class: 'psa__work-scheme__work-time-per-day',
    msgkey: 'Admin_Lbl_WorkTimePerDay',
    type: FIELD_NUMBER,
    display: DISPLAY_DETAIL,
    charType: 'numeric',
    isRequired: true,
    min: 0,
    max: 720,
  },
  {
    key: 'adminComment',
    class: 'psa__work-scheme__admin-comment',
    msgkey: 'Admin_Lbl_WorkSchemeAdminComment',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
];

const configList: ConfigListMap = { base };

export default configList;
