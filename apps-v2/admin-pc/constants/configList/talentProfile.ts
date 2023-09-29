import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import EmployeeProfileLinkContainer from '../../containers/EmployeeProfileLinkContainer';
import EmployeeFieldComponent from '../../containers/PsaEmployeeFieldContainer';

import EmployeeLinkSkillsetGridComponent from '../../components/SkillsetLinkConfig/EmployeeLinkSkillsetGridComponent';
import SkillsetLinkConfigComponent from '../../components/SkillsetLinkConfig/SkillsetLinkConfigComponent';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_CUSTOM, FIELD_TEXT, FIELD_TEXTAREA } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'empCode',
    msgkey: 'Com_Lbl_EmployeeCode',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'empNameL',
    msgkey: 'Com_Lbl_EmployeeName',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'empId',
    msgkey: 'Admin_Lbl_Employee',
    type: FIELD_CUSTOM,
    Component: EmployeeFieldComponent,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'skillsetConfig',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_skillset_config',
    msgkey: 'Admin_Lbl_Skillset',
    type: FIELD_CUSTOM,
    Component: SkillsetLinkConfigComponent,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'skills',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_skillset_grid',
    msgkey: 'Admin_Lbl_Skillset',
    type: FIELD_CUSTOM,
    Component: EmployeeLinkSkillsetGridComponent,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'links',
    class: 'admin-pc-links-detail',
    msgkey: 'Admin_Lbl_Link',
    type: FIELD_CUSTOM,
    Component: EmployeeProfileLinkContainer,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'remarks',
    class: 'admin-pc-links-detail',
    msgkey: 'Admin_Lbl_Remarks',
    type: FIELD_TEXTAREA,
    display: DISPLAY_DETAIL,
  },
];

const configList: ConfigListMap = { base };

export default configList;
