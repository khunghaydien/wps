import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_DATE, FIELD_TEXT, FIELD_TEXTAREA, FIELD_RADIO } =
  fieldType;
const { SIZE_LARGE } = fieldSize;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'recordDate',
    msgkey: 'Att_Lbl_Date',
    type: FIELD_DATE,
    isRequired: true,
  },
  {
    key: 'name_L0',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    size: SIZE_LARGE,
    isRequired: true,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    size: SIZE_LARGE,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    size: SIZE_LARGE,
  },
  {
    key: 'dayType',
    msgkey: 'Admin_Lbl_DayType',
    type: FIELD_RADIO,
    props: 'calendarRecordDayType',
    size: SIZE_LARGE,
    isRequired: true,
  },
  {
    key: 'remarks',
    msgkey: 'Admin_Lbl_Remarks',
    type: FIELD_TEXTAREA,
    size: SIZE_LARGE,
  },
];

const configList: ConfigListMap = { base };

export default configList;
