import { ConfigList, ConfigListMap } from '@apps/admin-pc/utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_NUMBER, FIELD_TEXTAREA } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL, DISPLAY_BOTH } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'code',
    class: 'psa_work-arrangement__code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
  },
  {
    key: 'name',
    class: 'psa_work-arrangement__name',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'name_L0',
    class: 'psa_work-arrangement__name--us',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  {
    key: 'name_L1',
    class: 'psa_work-arrangement__name--ja',
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
    key: 'workTime',
    class: 'psa__work-arrangement__work-time-per-day',
    msgkey: 'Admin_Lbl_WorkTime',
    type: FIELD_NUMBER,
    display: DISPLAY_BOTH,
    charType: 'numeric',
    isRequired: true,
    min: -720,
    max: 720,
  },
  {
    key: 'adminComment',
    class: 'psa__work-scheme__admin-comment',
    msgkey: 'Admin_Lbl_WorkArrangementAdminComment',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
];

const configList: ConfigListMap = { base };

export default configList;
