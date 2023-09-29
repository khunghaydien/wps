import { isEmpty } from 'lodash';

import displayType from '@admin-pc/constants/displayType';
import fieldSize from '@admin-pc/constants/fieldSize';
import fieldType from '@admin-pc/constants/fieldType';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

import DepartmentManagerViewGridContainer from '@apps/admin-pc-v2/containers/DepartmentManagerViewGridContainer';

import OrganizationHierarchyListComponent from '@admin-pc-v2/components/OrganizationHierarchy/OrganizationHierarchyListComponent';
import OrganizationHierarchyParentLabelComponent from '@admin-pc-v2/components/OrganizationHierarchy/OrganizationHierarchyParentLabelComponent';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_TEXTAREA,
  FIELD_VALID_DATE,
  FIELD_CUSTOM,
  FIELD_NONE,
} = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;
const { SIZE_LARGE } = fieldSize;

const adminListBaseItem =
  'admin-pc-contents-detail-pane__body__item-list__base-item';

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
    enableMode: 'new',
  },
  { key: 'companyId', type: FIELD_HIDDEN },
];

const history: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'baseId', type: FIELD_HIDDEN },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
    isRequired: true,
    enableMode: ['new', 'revision'],
  },
  { key: 'validDateTo', type: FIELD_HIDDEN, enableMode: ['new', 'revision'] },
  {
    key: 'comment',
    msgkey: 'Admin_Lbl_ReasonForRevision',
    type: FIELD_TEXT,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
    enableMode: ['new', 'revision'],
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
    key: 'remarks',
    msgkey: 'Admin_Lbl_Remarks',
    type: FIELD_TEXTAREA,
    size: SIZE_LARGE,
  },
  {
    section: 'Organization Information',
    msgkey: 'Admin_Lbl_OrganizationInformation',
    isExpandable: false,
    condition: (baseValueGetter) => !isEmpty(baseValueGetter('id')),
    configList: [
      {
        key: 'hierarchyPatternId',
        props: 'tmpEditRecord',
        msgkey: 'Admin_Lbl_OrganizationHierarchyPattern',
        type: FIELD_CUSTOM,
        Component: OrganizationHierarchyListComponent,
        enableMode: [''],
      },
      {
        key: 'hierarchyPatternParentName',
        props: 'tmpEditRecord',
        msgkey: 'Admin_Lbl_ParentDepartName',
        type: FIELD_CUSTOM,
        Component: OrganizationHierarchyParentLabelComponent,
        help: 'Admin_Hint_OrganizationHierarchyView',
      },
      {
        key: 'departmentManagerLabel',
        msgkey: 'Admin_Lbl_DepartmentManager',
        type: FIELD_NONE,
        condition: (baseValueGetter) => !isEmpty(baseValueGetter('id')),
      },
      {
        key: 'managers',
        msgkey: 'Admin_Lbl_DepartmentManager',
        type: FIELD_CUSTOM,
        Component: DepartmentManagerViewGridContainer,
        condition: (baseValueGetter) => !isEmpty(baseValueGetter('id')),
        class: `${adminListBaseItem}_no_label`,
      },
    ],
  },
];

const configList: ConfigListMap = {
  base,
  history,
};

export default configList;
