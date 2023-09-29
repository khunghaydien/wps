import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_CHECKBOX } = fieldType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'usePlanner',
    msgkey: 'Admin_Lbl_SelectFunction',
    label: 'Admin_Msg_UsePlanner',
    type: FIELD_CHECKBOX,
  },
  {
    key: 'useAttendance',
    label: 'Admin_Msg_UseAttendance',
    type: FIELD_CHECKBOX,
  },
  { key: 'useWorkTime', label: 'Admin_Msg_UseWorkTime', type: FIELD_CHECKBOX }, //  { key: 'useExpense', label: 'Admin_Msg_UseExpense', type: FIELD_CHECKBOX },
];

const configList: ConfigListMap = { base };

export default configList;
