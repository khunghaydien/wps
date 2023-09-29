import fieldValues from '../../../admin-pc/constants/fieldValues/orgHierarchyPattern';
import displayType from '@admin-pc/constants/displayType';
import fieldType from '@admin-pc/constants/fieldType';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_SELECT, FIELD_CHECKBOX } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const { module, orgHierarchyType } = fieldValues;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'companyId',
    type: FIELD_HIDDEN,
  },
  {
    key: 'viewHierarchy',
    msgkey: null,
    display: DISPLAY_LIST,
  },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
    enableMode: 'new',
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
    key: 'orgHierarchyType',
    props: 'orgHierarchyType',
    msgkey: 'Admin_Lbl_MasterType',
    type: FIELD_SELECT,
    options: orgHierarchyType,
    isRequired: true,
    multiLanguageValue: true,
  },
  {
    key: 'module',
    props: 'module',
    msgkey: 'Admin_Lbl_Module',
    type: FIELD_SELECT,
    options: module,
    isRequired: true,
    multiLanguageValue: true,
  },
  {
    key: 'active',
    msgkey: 'Admin_Lbl_Active',
    label: 'Admin_Msg_Active',
    type: FIELD_CHECKBOX,
    defaultValue: true,
  },
];

const configList: ConfigListMap = { base };

export default configList;
