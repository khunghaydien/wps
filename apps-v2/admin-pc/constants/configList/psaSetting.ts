import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { DISPLAY_DETAIL } = displayType;
const { FIELD_HIDDEN, FIELD_NUMBER, FIELD_CHECKBOX, FIELD_SELECT } = fieldType;
const { SIZE_SMALL } = fieldSize;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'defaultWorkTime',
    class: 'psa__setting__defaultWorkTime',
    msgkey: 'Admin_Lbl_DefaultWorkTime',
    type: FIELD_NUMBER,
    props: 'defaultWorkTime',
    min: 1,
    max: 12,
    step: 1,
    display: DISPLAY_DETAIL,
    isRequired: true,
    help: 'Admin_Help_DefaultWorkHours',
  },
  {
    key: 'allowCrossGroupSearch',
    msgkey: 'Admin_Lbl_AllowCrossGroupSearch',
    type: FIELD_CHECKBOX,
    props: 'allowCrossGroupSearch',
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_AllowCrossGroupSearch',
  },
  {
    key: 'useExistingJobCode',
    class: 'psa__setting__useExistingJobCode',
    msgkey: 'Admin_Lbl_UseExistingJobCode',
    type: FIELD_CHECKBOX,
    props: 'useExistingJobCode',
    display: DISPLAY_DETAIL,
    // help: 'Admin_Help_UseExistingJobCode',
  },
  {
    key: 'defaultCalendarId',
    msgkey: 'Psa_Lbl_DefaultProjectCalendar',
    type: FIELD_SELECT,
    props: 'calendarId',
    size: SIZE_SMALL,
    help: 'Admin_Help_DefaultProjectCalendar',
  },
  {
    key: 'enableProjectFinance',
    msgkey: 'Admin_Lbl_EnableProjectFinance',
    type: FIELD_CHECKBOX,
    props: 'enableProjectFinance',
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_EnableProjectFinance',
  },
  {
    key: 'enableProgressCheck',
    msgkey: 'Admin_Lbl_EnableProgressInput',
    type: FIELD_CHECKBOX,
    props: 'enableProgressCheck',
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_EnableProgressInput',
  },
  {
    key: 'allowSelfEditing',
    msgkey: 'Admin_Lbl_AllowSelfEditing',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_AllowSelfEditing',
  },
  {
    key: 'enableExpIntegration',
    msgkey: 'Admin_Lbl_EnableExpIntegration',
    type: FIELD_HIDDEN,
    props: 'enableExpIntegration',
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_EnableExpIntegration',
  },
  {
    key: 'useAttForCapacity',
    msgkey: 'Admin_Lbl_UseAttForCapacity',
    type: FIELD_CHECKBOX,
    props: 'useAttForCapacity',
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_UseAttForCapacity',
  },
  {
    key: 'defaultWorkSchemeId',
    msgkey: 'Admin_Lbl_DefaultWorkScheme',
    type: FIELD_SELECT,
    props: 'psaWorkSchemeId',
    size: SIZE_SMALL,
    help: 'Admin_Help_DefaultWorkScheme',
  },
];

const configList: ConfigListMap = { base };

export default configList;
