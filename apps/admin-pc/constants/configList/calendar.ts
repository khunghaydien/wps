import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_TEXTAREA } = fieldType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
  },
  {
    key: 'name_L0',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,

    isRequired: true,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
  },
  {
    key: 'remarks',
    msgkey: 'Admin_Lbl_Remarks',
    type: FIELD_TEXTAREA,
  },
];

const configList: ConfigListMap = {
  base,
};

export default configList;
