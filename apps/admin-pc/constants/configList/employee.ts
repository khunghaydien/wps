import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import CommuterRouteComponent from '../../components/CommuterRoute/CommuterRouteComponent';
import EmployeeFieldComponent from '../../components/EmployeeField/EmployeeFieldComponent';
import UserSelectionComponent from '../../components/UserSelectionField/UserSelectionComponent';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_DATE,
  FIELD_SELECT,
  FIELD_CHECKBOX,
  FIELD_CUSTOM,
  FIELD_USER_NAME,
  FIELD_AUTOSUGGEST_TEXT,
  FIELD_VALID_DATE,
  FIELD_SELECT_WITH_PLACEHOLDER,
} = fieldType;
const { SIZE_LARGE } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
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
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'validFrom',
    msgkey: 'Admin_Lbl_EnteringDate',
    type: FIELD_DATE,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'validTo',
    msgkey: 'Admin_Lbl_ExpireDate',
    type: FIELD_DATE,
    readOnly: true,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'hiredDate',
    msgkey: 'Admin_Lbl_HiredDate',
    type: FIELD_DATE,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'resignationDate',
    msgkey: 'Admin_Lbl_ResignationDate',
    type: FIELD_DATE,
    readOnly: true,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'userId',
    props: 'userId',
    msgkey: 'Admin_Lbl_User',
    display: DISPLAY_DETAIL,
    type: FIELD_CUSTOM,
    Component: UserSelectionComponent,
    isRequired: true,
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
    display: DISPLAY_DETAIL,
    size: SIZE_LARGE,
  },
  {
    section: 'Department',
    msgkey: 'Admin_Lbl_EmpSectDepartment',
    isExpandable: false,
    configList: [
      {
        key: 'departmentId',
        msgkey: 'Admin_Lbl_Department',
        dependent: 'department',
        props: 'departmentId',
        type: FIELD_AUTOSUGGEST_TEXT,
        autoSuggest: {
          value: 'id',
          label: 'name',
          buildLabel: (item) => `${item.code} - ${item.name}`,
          suggestionKey: ['id', 'code', 'name'],
        },
        help: 'Admin_Help_AutoSuggest',
      },
      {
        key: 'title',
        msgkey: 'Admin_Lbl_Position',
        type: FIELD_TEXT,
        display: DISPLAY_LIST,
      },
      {
        key: 'title_L0',
        msgkey: 'Admin_Lbl_Position',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'title_L1',
        msgkey: 'Admin_Lbl_Position',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'title_L2',
        msgkey: 'Admin_Lbl_Position',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'additionalDepartmentId',
        msgkey: 'Admin_Lbl_ConcurrentDepartment',
        props: 'departmentId',
        type: FIELD_AUTOSUGGEST_TEXT,
        autoSuggest: {
          value: 'id',
          label: 'name',
          buildLabel: (item) => `${item.code} - ${item.name}`,
          suggestionKey: ['id', 'code', 'name'],
        },
        help: 'Admin_Help_AutoSuggest',
      },
      {
        key: 'additionalTitle_L0',
        msgkey: 'Admin_Lbl_ConcurrentPosition',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'additionalTitle_L1',
        msgkey: 'Admin_Lbl_ConcurrentPosition',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'additionalTitle_L2',
        msgkey: 'Admin_Lbl_ConcurrentPosition',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'managerId',
        msgkey: 'Admin_Lbl_ManagerName',
        dependent: 'manager',
        type: FIELD_CUSTOM,
        Component: EmployeeFieldComponent,
      },
    ],
  },
  {
    section: 'General',
    msgkey: 'Admin_Lbl_EmpSectGeneral',
    isExpandable: false,
    configList: [
      {
        key: 'calendarId',
        msgkey: 'Admin_Lbl_Calendar',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        props: 'calendarId',
        display: DISPLAY_DETAIL,
      },
      {
        key: 'permissionId',
        msgkey: 'Admin_Lbl_AccessPermission',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        props: 'permissionId',
        display: DISPLAY_DETAIL,
        isRequired: true,
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
        key: 'workingTypeId',
        msgkey: 'Admin_Lbl_WorkingTypeName',
        type: FIELD_SELECT,
        dependent: 'workingType',
        props: 'workingTypeId',
        isRequired: true,
      },
      {
        key: 'agreementAlertSettingId',
        msgkey: 'Admin_Lbl_AgreementAlertSetting',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        dependent: 'agreementAlertSetting',
        props: 'agreementAlertSettingId',
        display: DISPLAY_DETAIL,
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
        key: 'timeSettingId',
        msgkey: 'Admin_Lbl_TimeSetting',
        type: FIELD_SELECT_WITH_PLACEHOLDER,
        dependent: 'timeSetting',
        props: 'timeSettingId',
        display: DISPLAY_DETAIL,
        isRequired: true,
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
        type: FIELD_SELECT,
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
        key: 'jobGradeId',
        msgkey: 'Admin_Lbl_JobGrade',
        props: 'jobGradeId',
        dependent: 'jobGrade',
        type: FIELD_SELECT,
        display: DISPLAY_DETAIL,
        action: 'searchJobGrade',
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
        msgkey: 'Admin_Lbl_UserData01',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'userData02',
        msgkey: 'Admin_Lbl_UserData02',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'userData03',
        msgkey: 'Admin_Lbl_UserData03',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'userData04',
        msgkey: 'Admin_Lbl_UserData04',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'userData05',
        msgkey: 'Admin_Lbl_UserData05',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'userData06',
        msgkey: 'Admin_Lbl_UserData06',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'userData07',
        msgkey: 'Admin_Lbl_UserData07',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'userData08',
        msgkey: 'Admin_Lbl_UserData08',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'userData09',
        msgkey: 'Admin_Lbl_UserData09',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'userData10',
        msgkey: 'Admin_Lbl_UserData10',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },
    ],
  },
];

const configList: ConfigListMap = { base, history };

export default configList;