import React from 'react';

import displayType from '@admin-pc/constants/displayType';
import fieldSize from '@admin-pc/constants/fieldSize';
import fieldType from '@admin-pc/constants/fieldType';

import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import { TYPE_LABELS } from '@admin-pc-v2/models/approverGroup';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

import ApproverGroupGridContainer from '@admin-pc-v2/containers/ApproverGroupContainer/ApproverGroupGridContainer';
import SpecificUserApproverGroupGridContainer from '@apps/admin-pc-v2/containers/ApproverGroupContainer/SpecificUserGroupGridContainer';

import DepartmentFieldComponent from '@admin-pc-v2/components/DepartmentField/DepartmentFieldComponent';

const { DISPLAY_BOTH, DISPLAY_LIST, DISPLAY_DETAIL } = displayType;
const { SIZE_SMALL, SIZE_LARGE } = fieldSize;
const { FIELD_CUSTOM, FIELD_HIDDEN, FIELD_SELECT, FIELD_TEXT } = fieldType;

export const ROOT = 'approver-group';

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
    display: DISPLAY_LIST,
  },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
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
    key: 'name_L0',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
    maxLength: 80,
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
    key: 'type',
    msgkey: 'Admin_Lbl_Type',
    type: FIELD_SELECT,
    display: DISPLAY_BOTH,
    isRequired: true,
    multiLanguageValue: true,
    options: Object.keys(TYPE_LABELS).map((key) => ({
      msgkey: TYPE_LABELS[key],
      value: key,
    })),
  },
  {
    key: 'departmentName',
    msgkey: 'Admin_Lbl_Target',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'targetDepartmentId',
    msgkey: 'Admin_Lbl_TargetDepartment',
    props: 'targetDepartmentId',
    type: FIELD_CUSTOM,
    display: DISPLAY_DETAIL,
    isRequired: true,
    size: SIZE_LARGE,
    condition: (baseValueGetter) => baseValueGetter('type') !== 'SpecificUsers',
    Component: DepartmentFieldComponent,
  },
  {
    key: 'approvers',
    msgkey: 'Admin_Lbl_Approvers',
    type: FIELD_CUSTOM,
    display: DISPLAY_DETAIL,
    class: `${ROOT}__approvers`,
    labelSize: SIZE_SMALL,
    condition: (baseValueGetter) => baseValueGetter('type') !== 'SpecificUsers',
    Component: ({ baseValueGetter }) => {
      const lastUpdatedAt = baseValueGetter('lastUpdatedAt');
      const lastUpdated = lastUpdatedAt
        ? DateUtil.formatWithIntl(new Date(lastUpdatedAt), {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', '')
        : '-';
      return (
        <span className={`${ROOT}__last-updated`}>{`${
          msg().Admin_Lbl_LastUpdated
        }: ${lastUpdated}`}</span>
      );
    },
  },
  {
    key: 'approvers',
    noLabel: true,
    type: FIELD_CUSTOM,
    display: DISPLAY_DETAIL,
    condition: (baseValueGetter) => baseValueGetter('type') !== 'SpecificUsers',
    Component: ApproverGroupGridContainer,
  },
  {
    key: 'userIds',
    noLabel: true,
    type: FIELD_CUSTOM,
    display: DISPLAY_DETAIL,
    condition: (baseValueGetter) => baseValueGetter('type') === 'SpecificUsers',
    Component: SpecificUserApproverGroupGridContainer,
  },
];

const configList: ConfigListMap = {
  base,
};

export default configList;
