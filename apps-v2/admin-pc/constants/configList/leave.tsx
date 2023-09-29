import React from 'react';

import FractionSelect from '@apps/admin-pc/presentational-components/Leave/FractionSelect';

import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_SELECT,
  FIELD_CHECKBOX,
  FIELD_VALID_DATE,
  FIELD_CUSTOM,
} = fieldType;
const { SIZE_SMALL, SIZE_LARGE } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
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
    key: 'leaveType',
    msgkey: 'Att_Lbl_LeaveType',
    type: FIELD_SELECT,
    props: 'leaveType',
    isRequired: true,
    enableMode: 'new',
    multiLanguageValue: true,
  },
  {
    key: 'daysManaged',
    msgkey: 'Admin_Lbl_DaysManaged',
    type: FIELD_CHECKBOX,
    size: SIZE_SMALL,
    display: DISPLAY_DETAIL,
    enableMode: 'new',
    condition: (valueGetter) =>
      valueGetter('leaveType') === 'Paid' ||
      valueGetter('leaveType') === 'Unpaid',
  },
  {
    key: 'leaveRanges',
    msgkey: 'Att_Lbl_Range',
    type: FIELD_SELECT,
    props: 'leaveRanges',
    isRequired: true,
    multiLanguageValue: true,
    multiple: true,
  },
  {
    key: 'countType',
    msgkey: 'Att_Lbl_AttendanceRateCountType',
    type: FIELD_SELECT,
    display: DISPLAY_DETAIL,
    props: 'countType',
    isRequired: true,
    multiLanguageValue: true,
    condition: (valueGetter) => !valueGetter('changeRequestDateToHoliday'),
  },
  {
    key: 'changeRequestDateToHoliday',
    msgkey: 'Att_Lbl_ChangeRequestDateToHoliday',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    condition: (valueGetter) =>
      valueGetter('leaveType') === 'Paid' ||
      valueGetter('leaveType') === 'Unpaid',
  },
  {
    key: 'availableSex',
    msgkey: 'Att_Lbl_LeaveAvailableSexType',
    type: FIELD_SELECT,
    display: DISPLAY_DETAIL,
    props: 'availableSex',
    isRequired: true,
    multiLanguageValue: true,
  },
  //  {
  //    key: 'summaryItemNo',
  //    msgkey: 'Att_Lbl_SummaryItemNo',
  //    type: FIELD_TEXT,
  //    size: SIZE_SMALL,
  //    charType: 'numeric',
  //  },
  {
    key: 'order',
    msgkey: 'Admin_Lbl_Order',
    type: FIELD_TEXT,
    size: SIZE_SMALL,
    charType: 'numeric',
  },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    display: DISPLAY_DETAIL,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'requireReason',
    msgkey: 'Admin_Lbl_NeedRequireReason',
    label: 'Admin_Lbl_RequireReason',
    type: FIELD_CHECKBOX,
    size: SIZE_SMALL,
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_LeaveRequireReason',
  },
  {
    key: 'useAdjustFraction',
    msgkey: 'Admin_Lbl_FractionProcessing',
    label: 'Admin_Lbl_LeaveFractionsAdjust',
    type: FIELD_CHECKBOX,
    size: SIZE_SMALL,
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_LeaveAdjustFraction',
    condition: (valueGetter) => valueGetter('leaveType') !== 'Substitute',
  },
  {
    key: 'adjustFractionsHalfDayOrUnder',
    subkey: 'adjustFractionsOneDayUnder',
    type: FIELD_CUSTOM,
    size: SIZE_SMALL,
    display: DISPLAY_DETAIL,
    enableMode: ['new', 'edit'],
    Component: (props) => (
      <FractionSelect
        {...props}
        childrenKeys={{
          halfDayOrUnder: 'adjustFractionsHalfDayOrUnder',
          oneDayUnder: 'adjustFractionsOneDayUnder',
        }}
      />
    ),
    condition: (valueGetter) =>
      !!valueGetter('useAdjustFraction') &&
      valueGetter('leaveType') !== 'Substitute',
  },
  {
    key: 'adjustFractionsHalfDayOrUnder',
    msgkey: 'Admin_Lbl_AdjustFractionsHalfDayOrUnder',
    type: FIELD_HIDDEN,
    defaultValue: 'None',
    isRequired: true,
    condition: (valueGetter) =>
      !!valueGetter('useAdjustFraction') &&
      valueGetter('leaveType') !== 'Substitute',
  },
  {
    key: 'adjustFractionsOneDayUnder',
    msgkey: 'Admin_Lbl_AdjustFractionsOneDayUnder',
    type: FIELD_HIDDEN,
    defaultValue: 'None',
    isRequired: true,
    condition: (valueGetter) =>
      !!valueGetter('useAdjustFraction') &&
      valueGetter('leaveType') !== 'Substitute',
  },
  {
    key: 'isRoundUpToOneDay',
    label: 'Admin_Lbl_IsRoundUpToOneDay',
    type: FIELD_CHECKBOX,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
    condition: (valueGetter) =>
      !!valueGetter('useAdjustFraction') &&
      valueGetter('adjustFractionsHalfDayOrUnder') === 'RoundUpToHalfDay' &&
      valueGetter('leaveType') !== 'Substitute',
  },
];

const configList: ConfigListMap = { base };

export default configList;
