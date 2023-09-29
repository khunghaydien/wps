import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_CHECKBOX } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'groupType', type: FIELD_HIDDEN, defaultValue: 'PsaGroup' },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_PsaGroupCode',
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
    section: 'Permission',
    msgkey: 'Admin_Lbl_AccessPermission',
    isExpandable: true,
    configList: [
      {
        section: 'Member',
        msgkey: 'Admin_Lbl_Member',
        isExpandable: false,
        configList: [
          {
            key: 'allowSelfReschedule',
            msgkey: 'Admin_Lbl_MemberAllowSelfReschedule',
            type: FIELD_CHECKBOX,
            display: DISPLAY_DETAIL,
          },
        ],
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
