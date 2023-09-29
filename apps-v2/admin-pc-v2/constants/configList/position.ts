import displayType from '@admin-pc/constants/displayType';
import fieldType from '@admin-pc/constants/fieldType';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_CHECKBOX } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  {
    key: 'id',
    type: FIELD_HIDDEN,
  },
  {
    key: 'companyId',
    type: FIELD_HIDDEN,
  },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
    maxLength: 20,
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
    isRequired: true,
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 80,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 80,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'active',
    msgkey: 'Admin_Lbl_Active',
    label: 'Admin_Msg_Active',
    type: FIELD_CHECKBOX,
    defaultValue: true,
  },
];

const configList: ConfigListMap = {
  base,
};

export default configList;
