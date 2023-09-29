import displayType from '@admin-pc/constants/displayType';
import fieldSize from '@admin-pc/constants/fieldSize';
import fieldType from '@admin-pc/constants/fieldType';

import { REVISION_TYPE_V2 } from '@apps/repositories/organization/employee/EmployeeDetailRepository';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

import TimeAutoHoursAllocateDictFieldContainer from '@admin-pc-v2/containers/EmployeeContainer/CustomFields/TimeAutoHoursAllocateDictFieldContainer';
import WorkingTypeContainer from '@admin-pc-v2/containers/EmployeeContainer/CustomFields/WorkingType/WorkingTypeContainer';

import CommuterRouteComponent from '@admin-pc/components/CommuterRoute/CommuterRouteComponent';
import EmployeeFieldComponent from '@admin-pc/components/EmployeeField/EmployeeFieldComponent';
import UserSelectionComponent from '@admin-pc/components/UserSelectionField/UserSelectionComponent';
import DepartmentFieldComponent from '@admin-pc-v2/components/DepartmentField/DepartmentFieldComponent';
import PositionFieldComponent from '@admin-pc-v2/components/PositionField/PositionFieldComponent';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_CHECKBOX,
  FIELD_CUSTOM,
  FIELD_USER_NAME,
  FIELD_AUTOSUGGEST_TEXT,
  FIELD_DATE,
  FIELD_SELECT,
  FIELD_SELECT_WITH_PLACEHOLDER,
} = fieldType;
const { SIZE_LARGE } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

export const revisionTypes = [
  {
    msgkey: 'Admin_Lbl_Active',
    value: REVISION_TYPE_V2.NewlyCreated,
  },
  {
    msgkey: 'Admin_Lbl_Active',
    value: REVISION_TYPE_V2.Revision,
  },
  // temporarily hide on leave option
  // {
  //   msgkey: 'Admin_Lbl_OnLeave',
  //   value: REVISION_TYPE_V2.Leave,
  // },
  {
    msgkey: 'Admin_Lbl_Resignation',
    value: REVISION_TYPE_V2.Resignation,
  },
];

export const sex = [
  {
    msgkey: 'Admin_Lbl_MaleSex',
    value: 'Male',
  },
  {
    msgkey: 'Admin_Lbl_FemaleSex',
    value: 'Female',
  },
];

export const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
    enableMode: 'new',
  },
  {
    key: 'name',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'lastName_L0',
    ltype: 'L0',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_USER_NAME,
    size: SIZE_LARGE,
    isRequired: true,
  },
  { key: 'firstName_L0', type: FIELD_HIDDEN },
  { key: 'middleName_L0', type: FIELD_HIDDEN },
  {
    key: 'lastName_L1',
    ltype: 'L1',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_USER_NAME,
    size: SIZE_LARGE,
  },
  { key: 'firstName_L1', type: FIELD_HIDDEN },
  { key: 'middleName_L1', type: FIELD_HIDDEN },
  {
    key: 'lastName_L2',
    ltype: 'L2',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_USER_NAME,
    size: SIZE_LARGE,
  },
  { key: 'firstName_L2', type: FIELD_HIDDEN },
  { key: 'middleName_L2', type: FIELD_HIDDEN },
  {
    key: 'userId',
    props: 'userId',
    msgkey: 'Admin_Lbl_User',
    display: DISPLAY_DETAIL,
    type: FIELD_CUSTOM,
    Component: UserSelectionComponent,
    isRequired: true,
  },
  {
    key: 'sex',
    msgkey: 'Admin_Lbl_Sex',
    type: FIELD_SELECT,
    options: sex,
    display: DISPLAY_DETAIL,
    multiLanguageValue: true,
  },
  {
    key: 'hiredDate',
    msgkey: 'Admin_Lbl_HiredDate',
    type: FIELD_DATE,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'resignationDate',
    msgkey: 'Admin_Lbl_ResignationDate',
    type: FIELD_DATE,
    readOnly: true,
    condition: (baseValueGetter) => {
      const resignDate = baseValueGetter('resignationDate');
      return !!resignDate && resignDate !== '2101-01-01';
    },
  },
];

const history: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'baseId', type: FIELD_HIDDEN },
  {
    key: 'primary',
    type: FIELD_HIDDEN,
    defaultValue: false,
  },
  {
    key: 'revisionType',
    msgkey: 'Admin_Lbl_Status',
    type: FIELD_SELECT_WITH_PLACEHOLDER,
    props: 'revisionType',
    display: DISPLAY_DETAIL,
    isRequired: true,
    options: revisionTypes,
    enableMode: ['revision'],
    multiLanguageValue: true,
    disableReset: true,
  },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDateFrom',
    type: FIELD_DATE,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
    isRequired: true,
    enableMode: ['new', 'add_sub_role', 'revision'],
  },
  {
    key: 'resignationDate',
    type: FIELD_HIDDEN,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'comment',
    msgkey: 'Admin_Lbl_ReasonForRevision',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    size: SIZE_LARGE,
    enableMode: ['new', 'add_sub_role', 'revision'],
  },
  {
    section: 'Department',
    msgkey: 'Admin_Lbl_Affiliation',
    isExpandable: false,
    configList: [
      {
        key: 'companyId',
        msgkey: 'Admin_Lbl_Company',
        type: FIELD_SELECT,
        props: 'companyId',
        display: DISPLAY_DETAIL,
        isRequired: true,
        enableMode: [],
      },

      {
        key: 'departmentId',
        msgkey: 'Admin_Lbl_Department',
        props: 'departmentId',
        type: FIELD_CUSTOM,
        Component: DepartmentFieldComponent,
        display: DISPLAY_DETAIL,
        isRequired: true,
        enableMode: ['new', 'add_sub_role', 'revision'],
        condition: (baseValueGetter, historyValueGetter) =>
          historyValueGetter('primary') === true,
      },

      // for sub role revision, disable department change
      {
        key: 'departmentId',
        msgkey: 'Admin_Lbl_Department',
        props: 'departmentId',
        type: FIELD_CUSTOM,
        Component: DepartmentFieldComponent,
        display: DISPLAY_DETAIL,
        isRequired: true,
        enableMode: ['new', 'add_sub_role'],
        condition: (baseValueGetter, historyValueGetter) =>
          !historyValueGetter('primary'),
      },

      {
        key: 'positionId',
        msgkey: 'Admin_Lbl_Position',
        props: 'positionId',
        type: FIELD_CUSTOM,
        Component: PositionFieldComponent,
        display: DISPLAY_DETAIL,
        enableMode: ['new', 'add_sub_role', 'revision'],
        condition: (baseValueGetter, historyValueGetter) =>
          historyValueGetter('primary') === true,
      },

      // for sub role revision, disable position change
      {
        key: 'positionId',
        msgkey: 'Admin_Lbl_Position',
        props: 'positionId',
        type: FIELD_CUSTOM,
        Component: PositionFieldComponent,
        display: DISPLAY_DETAIL,
        enableMode: ['new', 'add_sub_role'],
        condition: (baseValueGetter, historyValueGetter) =>
          !historyValueGetter('primary'),
      },
    ],
  },
  {
    section: 'General',
    msgkey: 'Admin_Lbl_EmpSectGeneral',
    isExpandable: false,
    configList: [
      {
        key: 'comFeatureAccessId',
        msgkey: 'Admin_Lbl_ComFeatureAccess',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        props: 'comFeatureAccessId',
        display: DISPLAY_DETAIL,
        isRequired: true,
        disableReset: true,
      },
      {
        key: 'calendarId',
        msgkey: 'Admin_Lbl_Calendar',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        props: 'calendarId',
        display: DISPLAY_DETAIL,
        disableReset: true,
      },
    ],
  },
  {
    section: 'Attendance',
    msgkey: 'Admin_Lbl_EmpSectAttendance',
    isExpandable: false,
    useFunction: 'useAttendance',
    configList: [
      {
        key: 'attFeatureAccessId',
        msgkey: 'Admin_Lbl_AttFeatureAccess',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        props: 'attFeatureAccessId',
        display: DISPLAY_DETAIL,
        isRequired: true,
        disableReset: true,
      },
      {
        key: 'workingTypeId',
        msgkey: 'Admin_Lbl_WorkingTypeName',
        type: FIELD_CUSTOM,
        dependent: 'workingType',
        props: 'workingTypeId',
        isRequired: true,
        disableReset: true,
        Component: WorkingTypeContainer,
      },
      {
        key: 'legalAgreementId',
        msgkey: 'Admin_Lbl_AttLegalAgreement',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        dependent: 'attLegalAgreement',
        props: 'legalAgreementId',
        display: DISPLAY_DETAIL,
        disableReset: true,
      },
      {
        key: 'agreementAlertSettingId',
        msgkey: 'Admin_Lbl_AgreementAlertSetting',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        dependent: 'agreementAlertSetting',
        props: 'agreementAlertSettingId',
        display: DISPLAY_DETAIL,
        disableReset: true,
      },
      {
        key: 'approvalAuthority01',
        msgkey: 'Admin_Lbl_ApprovalAuthority01',
        defaultValue: false,
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        help: 'Admin_Help_ApprovalAuthority01',
      },
    ],
  },
  {
    section: 'TimeTracking',
    msgkey: 'Admin_Lbl_EmpSectTimeTracking',
    isExpandable: false,
    useFunction: 'useWorkTime',
    configList: [
      {
        key: 'timeFeatureAccessId',
        msgkey: 'Admin_Lbl_TimeFeatureAccess',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        props: 'timeFeatureAccessId',
        display: DISPLAY_DETAIL,
        isRequired: true,
        disableReset: true,
      },
      {
        key: 'timeSettingId',
        msgkey: 'Admin_Lbl_TimeSetting',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        dependent: 'timeSetting',
        props: 'timeSettingId',
        display: DISPLAY_DETAIL,
        isRequired: true,
        disableReset: true,
      },
      {
        key: 'DUMMY__timeAutomaticWorkingHoursAllocation',
        msgkey: 'Time_Lbl_AutomaticWorkingHoursAllocation',
        type: FIELD_CUSTOM,
        Component: TimeAutoHoursAllocateDictFieldContainer,
        display: DISPLAY_DETAIL,
        condition: (baseValueGetter) => !!baseValueGetter('id'),
      },
    ],
  },
  {
    section: 'Expense',
    msgkey: 'Admin_Lbl_EmpSectExpense',
    isExpandable: false,
    useFunction: 'useExpense',
    configList: [
      {
        key: 'expFeatureAccessId',
        msgkey: 'Admin_Lbl_ExpFeatureAccess',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        props: 'expFeatureAccessId',
        display: DISPLAY_DETAIL,
        isRequired: true,
        disableReset: true,
      },
      {
        key: 'managerId',
        msgkey: 'Admin_Lbl_ManagerName',
        dependent: 'manager',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
      },
      {
        key: 'costCenterId',
        msgkey: 'Admin_Lbl_CostCenterName',
        dependent: 'costCenter',
        props: 'costCenterId',
        type: FIELD_AUTOSUGGEST_TEXT,
        display: DISPLAY_DETAIL,
        autoSuggest: {
          value: 'id',
          label: 'name',
          buildLabel: (item) => `${item.code} - ${item.name}`,
          suggestionKey: ['id', 'code', 'name'],
        },
        help: 'Admin_Help_AutoSuggest',
      },
      {
        key: 'expEmployeeGroupId',
        msgkey: 'Admin_Lbl_EmployeeGroup',
        dependent: 'group',
        props: 'expEmployeeGroupId',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        disableReset: true,
        display: DISPLAY_DETAIL,
        isRequired: true,
      },
      {
        key: 'commuterPassAvailable',
        msgkey: 'Admin_Lbl_UseCommuterPass',
        defaultValue: false,
        type: FIELD_CHECKBOX,
        useFunction: 'useExpense',
        display: DISPLAY_DETAIL,
      },
      {
        key: 'jorudanRoute',
        msgkey: 'Com_Lbl_Route',
        type: FIELD_CUSTOM,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
        isRequired: true,
        Component: CommuterRouteComponent,
        condition: (baseValueGetter, historyValueGetter) =>
          historyValueGetter('commuterPassAvailable') === true,
      },
    ],
  },
  {
    section: 'Project',
    msgkey: 'Admin_Lbl_EmpSectProject',
    isExpandable: false,
    useFunction: 'usePsa',
    configList: [
      {
        key: 'psaFeatureAccessId',
        msgkey: 'Admin_Lbl_PsaFeatureAccess',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        props: 'psaFeatureAccessId',
        display: DISPLAY_DETAIL,
        isRequired: true,
        disableReset: true,
      },
      {
        key: 'jobGradeId',
        msgkey: 'Admin_Lbl_JobGrade',
        props: 'jobGradeId',
        dependent: 'jobGrade',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        display: DISPLAY_DETAIL,
        action: 'searchJobGrade',
        disableReset: true,
      },
    ],
  },
  {
    section: 'Approvers',
    msgkey: 'Admin_Lbl_EmpSectApprovers',
    isExpandable: false,
    configList: [
      {
        key: 'approver01Id',
        msgkey: 'Admin_Lbl_Approver01Name',
        dependent: 'approver01',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approver02Id',
        msgkey: 'Admin_Lbl_Approver02Name',
        dependent: 'approver02',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approver03Id',
        msgkey: 'Admin_Lbl_Approver03Name',
        dependent: 'approver03',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approver04Id',
        msgkey: 'Admin_Lbl_Approver04Name',
        dependent: 'approver04',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approver05Id',
        msgkey: 'Admin_Lbl_Approver05Name',
        dependent: 'approver05',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approver06Id',
        msgkey: 'Admin_Lbl_Approver06Name',
        dependent: 'approver06',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approver07Id',
        msgkey: 'Admin_Lbl_Approver07Name',
        dependent: 'approver07',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approver08Id',
        msgkey: 'Admin_Lbl_Approver08Name',
        dependent: 'approver08',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approver09Id',
        msgkey: 'Admin_Lbl_Approver09Name',
        dependent: 'approver09',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approver10Id',
        msgkey: 'Admin_Lbl_Approver10Name',
        dependent: 'approver10',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: 'UserData',
    msgkey: 'Admin_Lbl_EmpSectUserData',
    isExpandable: false,
    configList: [
      {
        key: 'userData01',
        msgkey: '$Att_Lbl_UserData01',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData01',
      },
      {
        key: 'userData02',
        msgkey: '$Att_Lbl_UserData02',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData02',
      },
      {
        key: 'userData03',
        msgkey: '$Att_Lbl_UserData03',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData03',
      },
      {
        key: 'userData04',
        msgkey: '$Att_Lbl_UserData04',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData04',
      },
      {
        key: 'userData05',
        msgkey: '$Att_Lbl_UserData05',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData05',
      },
      {
        key: 'userData06',
        msgkey: '$Att_Lbl_UserData06',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData06',
      },
      {
        key: 'userData07',
        msgkey: '$Att_Lbl_UserData07',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData07',
      },
      {
        key: 'userData08',
        msgkey: '$Att_Lbl_UserData08',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData08',
      },
      {
        key: 'userData09',
        msgkey: '$Att_Lbl_UserData09',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData09',
      },
      {
        key: 'userData10',
        msgkey: '$Att_Lbl_UserData10',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData10',
      },
      {
        key: 'userData11',
        msgkey: '$Att_Lbl_UserData11',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData11',
      },
      {
        key: 'userData12',
        msgkey: '$Att_Lbl_UserData12',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData12',
      },
      {
        key: 'userData13',
        msgkey: '$Att_Lbl_UserData13',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData13',
      },
      {
        key: 'userData14',
        msgkey: '$Att_Lbl_UserData14',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData14',
      },
      {
        key: 'userData15',
        msgkey: '$Att_Lbl_UserData15',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData15',
      },
      {
        key: 'userData16',
        msgkey: '$Att_Lbl_UserData16',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData16',
      },
      {
        key: 'userData17',
        msgkey: '$Att_Lbl_UserData17',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData17',
      },
      {
        key: 'userData18',
        msgkey: '$Att_Lbl_UserData18',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData18',
      },
      {
        key: 'userData19',
        msgkey: '$Att_Lbl_UserData19',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData19',
      },
      {
        key: 'userData20',
        msgkey: '$Att_Lbl_UserData20',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
        help: '$Att_Help_UserData20',
      },
    ],
  },
];

const configList: ConfigListMap = { base, history };

export default configList;
