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
  },
  {
    key: 'allowCrossGroupSearch',
    msgkey: 'Admin_Lbl_AllowCrossGroupSearch',
    type: FIELD_CHECKBOX,
    props: 'allowCrossGroupSearch',
    display: DISPLAY_DETAIL,
  },
  {
    key: 'useExistingJobCode',
    class: 'psa__setting__useExistingJobCode',
    msgkey: 'Admin_Lbl_UseExistingJobCode',
    type: FIELD_CHECKBOX,
    props: 'useExistingJobCode',
    display: DISPLAY_DETAIL,
  },
  {
    key: 'defaultCalendarId',
    msgkey: 'Psa_Lbl_DefaultProjectCalendar',
    type: FIELD_SELECT,
    props: 'calendarId',
    size: SIZE_SMALL,
  },
];

const configList: ConfigListMap = { base };

export default configList;
