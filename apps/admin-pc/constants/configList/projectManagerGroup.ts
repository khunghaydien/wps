import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

// Custom compnent to display project manager name
import ProjectManagerNameComponent from '../../containers/ProjectManagerNameContainer';

import ProjectManagerListLinkEmployeeMemberGridComponent from '../../components/EmployeeMemberLinkConfig/ProjectManagerListLinkEmployeeMemberGridComponent';
// Select Resource Managers
import ResourceGroupMemberLinkConfigComponent from '../../components/EmployeeMemberLinkConfig/ResourceGroupMemberLinkConfigComponent';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_CUSTOM } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'name',
    msgkey: 'Admin_Lbl_ManagerName',
    class: 'psa__resource-group__name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'code',
    class: 'psa__resource-group__code',
    msgkey: 'Admin_Lbl_PsaGroupCode',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'ownerName',
    class: 'admin-pc-psa__owner-name',
    msgkey: 'Psa_Lbl_ProjectManager',
    type: FIELD_CUSTOM,
    Component: ProjectManagerNameComponent,
    useFunction: 'usePsa',
    display: DISPLAY_DETAIL,
  },
  {
    key: 'groupType',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_employee-member_config project-manager-group',
    msgkey: 'Admin_Lbl_ResourceManager',
    type: FIELD_CUSTOM,
    useFunction: 'usePsa',
    Component: ResourceGroupMemberLinkConfigComponent,
    display: DISPLAY_DETAIL,
    defaultValue: 'ManagerGroup',
  },
  {
    key: 'members',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_employee-member_grid project-manager-group',
    msgkey: 'Admin_Lbl_PsaManagerList',
    type: FIELD_CUSTOM,
    useFunction: 'usePsa',
    Component: ProjectManagerListLinkEmployeeMemberGridComponent,
    display: DISPLAY_DETAIL,
  },
];

const configList: ConfigListMap = { base };

export default configList;
