import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import ManagerListLinkConfigComponent from '../../components/EmployeeMemberLinkConfig/EmployeeMemberLinkConfigComponent';
import ManagerListLinkEmployeeMemberGridComponent from '../../components/EmployeeMemberLinkConfig/ManagerListLinkEmployeeMemberGridComponent';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_CHECKBOX, FIELD_CUSTOM } = fieldType;

const { SIZE_MEDIUM } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  { key: 'parentName', type: FIELD_HIDDEN },
  {
    key: 'code',
    class: 'psa__managerList__code',
    msgkey: 'Admin_Lbl_PsaGroupCode',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'name',
    class: 'psa__managerListArray__name',
    msgkey: 'Admin_Lbl_PsaGroupName',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'parentName',
    msgkey: 'Admin_Lbl_PSAGroupLabel',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    readOnly: true,
  },
  {
    key: 'parentId',
    msgkey: 'Admin_Lbl_PSAGroupLabel',
    type: FIELD_HIDDEN,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'groupType',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_employee-member_config',
    msgkey: 'Admin_Lbl_PsaManagerList',
    type: FIELD_CUSTOM,
    useFunction: 'usePsa',
    Component: ManagerListLinkConfigComponent,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'members',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_employee-member_grid',
    msgkey: 'Admin_Lbl_PsaManagerList',
    type: FIELD_CUSTOM,
    useFunction: 'usePsa',
    Component: ManagerListLinkEmployeeMemberGridComponent,
    display: DISPLAY_DETAIL,
  },
  {
    section: 'ProjectsPermissionSetting',
    msgkey: 'Psa_Lbl_PermissionControl',
    isExpandable: true,
    configList: [
      {
        key: 'canUploadProjectRoles',
        msgkey: 'Admin_Lbl_PsaCanUploadProjectRoles',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
      },
      {
        key: 'canConfirmProjectRoles',
        msgkey: 'Admin_Lbl_PsaCanConfirmProjectRoles',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
