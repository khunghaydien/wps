import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

// Employees
import ManagerListLinkConfigComponent from '../../components/EmployeeMemberLinkConfig/EmployeeMemberLinkConfigComponent';
import ManagerListLinkEmployeeMemberGridComponent from '../../components/EmployeeMemberLinkConfig/ManagerListLinkEmployeeMemberGridComponent';
// Resource Manager
import ResourceGroupMemberLinkConfigComponent from '../../components/EmployeeMemberLinkConfig/ResourceGroupMemberLinkConfigComponent';
import ResourceManagerListLinkEmployeeMemberGridComponent from '../../components/EmployeeMemberLinkConfig/ResourceManagerListLinkEmployeeMemberGridComponent';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_CUSTOM } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'name',
    class: 'psa__job__name',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'code',
    class: 'psa__resource-group__code',
    msgkey: 'Admin_Lbl_PsaGroupCode',
    type: FIELD_TEXT,
    isRequired: true,
  },
  {
    key: 'name_L0',
    class: 'psa__job__name--us',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  {
    key: 'name_L1',
    class: 'psa__job__name--ja',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'email',
    isRequired: false,
    msgkey: 'Psa_Lbl_CapabilityEmail',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'groupType',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_employee-member_config',
    msgkey: 'Admin_Lbl_ResourceManager',
    type: FIELD_CUSTOM,
    useFunction: 'usePsa',
    Component: ResourceGroupMemberLinkConfigComponent,
    display: DISPLAY_DETAIL,
    defaultValue: 'ResourceGroup',
  },
  {
    key: 'owners',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_employee-member_grid resource-group',
    msgkey: 'Admin_Lbl_ResourceManager',
    type: FIELD_CUSTOM,
    useFunction: 'usePsa',
    Component: ResourceManagerListLinkEmployeeMemberGridComponent,
    display: DISPLAY_DETAIL,
  }, // Employees
  {
    key: 'empGroupType',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_employee-member_config resource-manager-group',
    msgkey: 'Psa_Lbl_Resources',
    type: FIELD_CUSTOM,
    useFunction: 'usePsa',
    Component: ManagerListLinkConfigComponent,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'members',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_employee-member_grid',
    msgkey: 'Psa_Lbl_Resources',
    type: FIELD_CUSTOM,
    useFunction: 'usePsa',
    Component: ManagerListLinkEmployeeMemberGridComponent,
    display: DISPLAY_DETAIL,
  },
];

const configList: ConfigListMap = { base };

export default configList;
