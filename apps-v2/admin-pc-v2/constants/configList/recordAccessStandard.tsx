import React from 'react';

import displayType from '@admin-pc/constants/displayType';
import fieldSize from '@admin-pc/constants/fieldSize';
import fieldType from '@admin-pc/constants/fieldType';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

import RecordAccessStandardSpecialCasesContainer from '@admin-pc-v2/containers/RecordAccessStandardSpecialCasesContainer';

import OrganizationHierarchyListComponent from '@admin-pc-v2/components/OrganizationHierarchy/OrganizationHierarchyListComponent';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_CUSTOM,
  FIELD_VALID_DATE,
  FIELD_CHECKBOX,
} = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;
const { SIZE_LARGE, SIZE_MEDIUM } = fieldSize;

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
    key: 'name',
    msgkey: 'Admin_Lbl_Name',
    isRequired: true,
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 80,
  },
  {
    key: 'orgHierarchyPtnName',
    msgkey: 'Admin_Lbl_OrganizationHierarchyPattern',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'orgHierarchyPtnId',
    msgkey: 'Admin_Lbl_OrganizationHierarchyPattern',
    type: FIELD_CUSTOM,
    display: DISPLAY_DETAIL,
    Component: (props) => (
      <OrganizationHierarchyListComponent
        defaultDisableCheck
        {...props}
        objectKey="orgHierarchyPtnId"
      />
    ),
  },
  { key: 'permissionType', type: FIELD_HIDDEN, display: DISPLAY_DETAIL },
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
    section: 'Record Access Standard Default',
    msgkey: 'Admin_Lbl_RecordAccessReferenceDefault',
    isExpandable: false,
    configList: [
      {
        key: 'managerDisabled',
        help: 'Admin_Lbl_DisableAccessDeptManagerHint',
        msgkey: 'Admin_Lbl_DisableAccessDeptManager',
        type: FIELD_CHECKBOX,
        size: SIZE_MEDIUM,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        defaultValue: false,
      },
      {
        key: 'parentDisabled',
        help: 'Admin_Lbl_DisableAccessParentManagerHint',
        msgkey: 'Admin_Lbl_DisableAccessParentManager',
        type: FIELD_CHECKBOX,
        size: SIZE_MEDIUM,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        defaultValue: false,
      },
      {
        key: 'grantRAToDeptMgrOnly',
        help: 'Admin_Lbl_GrantRecordAccessToDeptManagerOnlyHint',
        msgkey: 'Admin_Lbl_GrantRecordAccessToDeptManagerOnly',
        type: FIELD_CHECKBOX,
        size: SIZE_MEDIUM,
        display: DISPLAY_DETAIL,
        labelSize: SIZE_MEDIUM,
        defaultValue: false,
      },
    ],
  },
  {
    section: 'Record Access Standard Special Cases',
    msgkey: 'Admin_Lbl_RecordAccessReferenceIndividual',
    isExpandable: false,
    configList: [
      {
        key: 'recordAccessHierarchyRecords',
        props: 'tmpEditRecord',
        type: FIELD_CUSTOM,
        display: DISPLAY_DETAIL,
        noLabel: true,
        Component: RecordAccessStandardSpecialCasesContainer,
      },
    ],
  },
];

const configList: ConfigListMap = {
  base,
};

export default configList;
