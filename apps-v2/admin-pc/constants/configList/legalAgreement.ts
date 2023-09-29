import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import LimitHourListContainer from '../../containers/LegalAgreementContainer/LimitHourListContainer';
import SpecialHourListContainer from '../../containers/LegalAgreementContainer/SpecialHourListContainer';

import OvertimeColumn from '../../presentational-components/LegalAgreement/DetailPane/OvertimeColumn';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_SELECT_WITH_PLACEHOLDER,
  FIELD_VALID_DATE,
  FIELD_CUSTOM,
  FIELD_CHECKBOX,
  FIELD_TIME,
} = fieldType;
const { SIZE_SMALL, SIZE_LARGE } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const adminListBaseItem =
  'admin-pc-contents-detail-pane__body__item-list__base-item';

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
    key: 'workSystem',
    msgkey: 'Admin_Lbl_LegalAgreementWorkSystem',
    type: FIELD_SELECT_WITH_PLACEHOLDER,
    props: 'workingTypeWorkSystem',
    display: DISPLAY_DETAIL,
    isRequired: true,
    disableReset: true,
    multiLanguageValue: true,
    enableMode: 'new',
  },
  {
    key: 'groupId',
    msgkey: 'Admin_Lbl_LegalAgreementGroup',
    type: FIELD_SELECT_WITH_PLACEHOLDER,
    props: 'legalAgreementGroupId',
    isRequired: true,
    disableReset: true,
  },
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
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'comment',
    msgkey: 'Admin_Lbl_ReasonForRevision',
    type: FIELD_TEXT,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
  },
  {
    section: 'AgreementTime',
    msgkey: 'Admin_Lbl_AgreementObjectTime',
    isExpandable: true,
    configList: [
      {
        key: 'useStandardContractedWorkHours',
        msgkey: 'Admin_Lbl_UseStandardWorkingHours',
        label: 'Admin_Lbl_Use',
        type: FIELD_CHECKBOX,
        size: SIZE_SMALL,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'standardContractedWorkHours',
        msgkey: 'Admin_Lbl_StandardContractedWorkHours',
        type: FIELD_TIME,
        isRequired: true,
        display: DISPLAY_DETAIL,
        condition: (_baseValueGetter, historyValueGetter) =>
          historyValueGetter('useStandardContractedWorkHours') === true,
      },
      {
        key: 'monthlyOvertimeColumn',
        msgkey: 'Att_Lbl_MonthlyOvertimeColumn',
        help: 'Att_Msg_HelpOvertimeColumn',
        type: FIELD_CUSTOM,
        display: DISPLAY_DETAIL,
        Component: OvertimeColumn,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'Manager',
      },
      {
        key: 'yearlyOvertimeColumn',
        msgkey: 'Att_Lbl_YearlyOvertimeColumn',
        help: 'Att_Msg_HelpOvertimeColumn',
        type: FIELD_CUSTOM,
        display: DISPLAY_DETAIL,
        Component: OvertimeColumn,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'Manager',
      },
      {
        key: 'multiMonthOvertimeColumn',
        msgkey: 'Att_Lbl_MultiMonthOvertimeColumn',
        help: 'Att_Msg_HelpOvertimeColumn',
        type: FIELD_CUSTOM,
        display: DISPLAY_DETAIL,
        Component: OvertimeColumn,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'Manager',
      },
      {
        key: 'specialMonthlyOvertimeColumn',
        msgkey: 'Att_Lbl_SpecialMonthlyOvertimeColumn',
        class: 'legal-agreement__show-left-item',
        help: 'Att_Msg_HelpOvertimeColumn',
        type: FIELD_CUSTOM,
        display: DISPLAY_DETAIL,
        Component: OvertimeColumn,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'Manager',
      },
      {
        key: 'specialYearlyOvertimeColumn',
        msgkey: 'Att_Lbl_SpecialYearlyOvertimeColumn',
        class: 'legal-agreement__show-left-item',
        help: 'Att_Msg_HelpOvertimeColumn',
        type: FIELD_CUSTOM,
        display: DISPLAY_DETAIL,
        Component: OvertimeColumn,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') !== 'Manager',
      },
    ],
  },
  {
    section: '36LegalAgreement',
    msgkey: 'Admin_Lbl_36LegalAgreement',
    condition: (baseValueGetter) => baseValueGetter('workSystem') !== 'Manager',
    isExpandable: true,
    configList: [
      {
        key: 'overtimeWorkWithinTheLimitList',
        msgkey: 'Admin_Lbl_OvertimeWorkWithinTheLimit',
        type: FIELD_CUSTOM,
        Component: LimitHourListContainer,
        class: `${adminListBaseItem}_no_label`,
      },
      {
        key: 'overtimeWorkInExcessOfLimitList',
        msgkey: 'Admin_Lbl_OvertimeWorkInExcessOfLimit',
        type: FIELD_CUSTOM,
        Component: SpecialHourListContainer,
        class: `${adminListBaseItem}_no_label`,
      },
    ],
  },
  {
    section: 'healthManagement',
    msgkey: 'Admin_Lbl_HealthManagement',
    condition: (baseValueGetter) => baseValueGetter('workSystem') === 'Manager',
    isExpandable: true,
    configList: [
      {
        key: 'overtimeWorkWithinTheLimitList',
        msgkey: 'Admin_Lbl_OvertimeWorkWithinTheLimit',
        type: FIELD_CUSTOM,
        Component: LimitHourListContainer,
        class: `${adminListBaseItem}_no_label`,
      },
      {
        key: 'overtimeWorkInExcessOfLimitList',
        msgkey: 'Admin_Lbl_OvertimeWorkInExcessOfLimit',
        type: FIELD_CUSTOM,
        Component: SpecialHourListContainer,
        class: `${adminListBaseItem}_no_label`,
      },
    ],
  },
];

const configList: ConfigListMap = { base, history };

export default configList;
