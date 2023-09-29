import React from 'react';
import displayType from '@admin-pc/constants/displayType';
import fieldType from '@admin-pc/constants/fieldType';
import fieldSize from '@admin-pc/constants/fieldSize';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

import OrganizationHierarchyListComponent from '@admin-pc-v2/components/OrganizationHierarchy/OrganizationHierarchyListComponent';
import RecordAccessTargetToGivePrivilege from '@admin-pc-v2/components/RecordAccess/RecordAccessTargetToGivePrivilege';
import DepartmentFieldComponent from '@admin-pc-v2/components/DepartmentField/DepartmentFieldComponent';
import EmployeeFieldComponent from '@admin-pc/components/EmployeeField/EmployeeFieldComponent';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_CUSTOM,
  FIELD_VALID_DATE,
  FIELD_SELECT,
} = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;
const { SIZE_LARGE } = fieldSize;

export enum TARGET {
  Department = 'Department',
  Employee = 'Employee',
}

export const targetOptions = [
  { msgkey: 'Admin_Lbl_Department', value: TARGET.Department },
  { msgkey: 'Admin_Lbl_Employee', value: TARGET.Employee },
];

export enum TARGET_DIALOG_LABEL {
  Department = 'Department To Show',
  Employee = 'Employee To Show',
}

const isTargetDepartment = (baseValueGetter) => {
  const target = baseValueGetter('target');
  return target === TARGET.Department;
};

const isTargetEmployee = (baseValueGetter) => {
  const target = baseValueGetter('target');
  return target === TARGET.Employee;
};

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
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
    isRequired: true,
    enableMode: ['new', 'revision'],
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'orgHierarchyPtnName',
    msgkey: 'Admin_Lbl_OrganizationHierarchyPattern',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    section: 'Target To Be Seen',
    msgkey: 'Admin_Lbl_TargetToBeSeen',
    isExpandable: false,
    configList: [
      {
        msgkey: 'Exp_Lbl_Target',
        key: 'target',
        type: FIELD_SELECT,
        options: targetOptions,
        display: DISPLAY_DETAIL,
        isRequired: true,
      },
      {
        key: 'orgHierarchyPtnId',
        msgkey: 'Admin_Lbl_OrganizationHierarchyPattern',
        type: FIELD_CUSTOM,
        display: DISPLAY_DETAIL,
        isRequired: true,
        Component: (props) => (
          <OrganizationHierarchyListComponent
            defaultDisableCheck
            {...props}
            objectKey="orgHierarchyPtnId"
          />
        ),
        condition: (baseValueGetter) => {
          return isTargetDepartment(baseValueGetter);
        },
      },
      {
        key: 'deptBaseId',
        msgkey: 'Admin_Lbl_ToShowDept',
        props: 'departmentId',
        type: FIELD_CUSTOM,
        Component: DepartmentFieldComponent,
        display: DISPLAY_DETAIL,
        isRequired: true,
        condition: (baseValueGetter) => {
          return isTargetDepartment(baseValueGetter);
        },
      },
      {
        key: 'empBaseId',
        msgkey: 'Admin_Lbl_ToShowEmp',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
        isRequired: true,
        condition: (baseValueGetter) => {
          return isTargetEmployee(baseValueGetter);
        },
      },
    ],
  },
  {
    section: 'Target To Give Privilege',
    msgkey: 'Admin_Lbl_TargetToGivePrivilege',
    isExpandable: false,
    configList: [
      {
        key: 'recordAccessTargetToGivePrivilege',
        props: 'tmpEditRecord',
        type: FIELD_CUSTOM,
        display: DISPLAY_DETAIL,
        noLabel: true,
        Component: RecordAccessTargetToGivePrivilege,
      },
    ],
  },
];

const configList: ConfigListMap = {
  base,
};

export default configList;
