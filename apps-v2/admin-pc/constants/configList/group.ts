import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import DualListboxComponent from '../../presentational-components/EmployeeGroup/DualListboxComponent';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_CHECKBOX, FIELD_CUSTOM } = fieldType;
const { DISPLAY_DETAIL, DISPLAY_LIST } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
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
    key: 'description_L0',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'description_L1',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'active',
    msgkey: 'Admin_Lbl_Active',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'reportTypeIdList',
    class:
      'admin-pc-contents-detail-pane__body__item-list__base-item_dual_listbox',
    msgkey: 'Admin_Lbl_ReportType',
    type: FIELD_CUSTOM,
    display: DISPLAY_DETAIL,
    useFunction: 'useExpense',
    Component: DualListboxComponent,
  },
];

const configList: ConfigListMap = { base };

export default configList;
