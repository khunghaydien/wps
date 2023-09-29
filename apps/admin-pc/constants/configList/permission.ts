import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_CHECKBOX, FIELD_TEXT, FIELD_HIDDEN } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

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
    section: 'Timesheet',
    msgkey: 'Admin_Lbl_PermissionTimesheet',
    isExpandable: true,
    useFunction: 'useAttendance',
    configList: [
      {
        key: 'viewAttTimesheetByDelegate',
        msgkey: 'Admin_Lbl_PermissionTimesheetByDelegate',
        label: 'Admin_Lbl_PermissionView',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'editAttTimesheetByDelegate',
        label: 'Admin_Lbl_PermissionEdit',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: 'Daily Request',
    msgkey: 'Admin_Lbl_PermissionAttDailyRequest',
    isExpandable: true,
    useFunction: 'useAttendance',
    configList: [
      {
        key: 'cancelAttDailyApprovalByEmployee',
        msgkey: 'Admin_Lbl_PermissionAttRequestByEmployee',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approveSelfAttDailyRequestByEmployee',
        label: 'Admin_Lbl_PermissionApproveSelfAttRequestByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'submitAttDailyRequestByDelegate',
        msgkey: 'Admin_Lbl_PermissionAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionSubmitAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'cancelAttDailyRequestByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approveAttDailyRequestByDelegate',
        label: 'Admin_Lbl_PermissionApproveAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'cancelAttDailyApprovalByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'bulkApprovalAttDailyRequest',
        msgkey: 'Admin_Lbl_PermissionBulkApproval',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: 'Monthly Request',
    msgkey: 'Admin_Lbl_PermissionAttMonthlyRequest',
    isExpandable: true,
    useFunction: 'useAttendance',
    configList: [
      {
        key: 'cancelAttApprovalByEmployee',
        msgkey: 'Admin_Lbl_PermissionAttRequestByEmployee',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approveSelfAttRequestByEmployee',
        label: 'Admin_Lbl_PermissionApproveSelfAttRequestByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'submitAttRequestByDelegate',
        msgkey: 'Admin_Lbl_PermissionAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionSubmitAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'cancelAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approveAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionApproveAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'cancelAttApprovalByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'bulkApprovalAttRequest',
        msgkey: 'Admin_Lbl_PermissionBulkApproval',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: 'Time Track',
    msgkey: 'Admin_Lbl_PermissionTimeTrack',
    isExpandable: true,
    useFunction: 'useWorkTime',
    configList: [
      {
        key: 'viewTimeTrackByDelegate',
        msgkey: 'Admin_Lbl_PermissionTimeTrackByDelegate',
        label: 'Admin_Lbl_PermissionView',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'editTimeTrackByDelegate',
        label: 'Admin_Lbl_PermissionEdit',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: 'Time Track Request',
    msgkey: 'Admin_Lbl_PermissionTimeTrackRequest',
    isExpandable: true,
    useFunction: 'useWorkTime',
    configList: [
      {
        key: 'cancelTimeApprovalByEmployee',
        msgkey: 'Admin_Lbl_PermissionAttRequestByEmployee',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'submitTimeRequestByDelegate',
        msgkey: 'Admin_Lbl_PermissionAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionSubmitAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'cancelTimeRequestByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'cancelTimeApprovalByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: 'Expense',
    msgkey: 'Admin_Lbl_ExpenseRequest',
    isExpandable: true,
    useFunction: 'useExpense',
    configList: [
      {
        key: 'createExpRecordFromIcCardTxn',
        msgkey: 'Exp_Lbl_CreateRecordFromIcCard',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'approveExpRequestInDiffCompany',
        msgkey: 'Admin_Lbl_PermissionExpCrossCompaniesApproval',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'usePersonalVendor',
        msgkey: 'Admin_Lbl_PermissionPersonalVendor',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: 'Management',
    msgkey: 'Admin_Lbl_PermissionManagement',
    isExpandable: true,
    configList: [
      {
        key: 'manageOverallSetting',
        msgkey: 'Admin_Lbl_PermissionManageOverallSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'switchCompany',
        msgkey: 'Admin_Lbl_PermissionSwitchCompany',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'manageDepartment',
        msgkey: 'Admin_Lbl_PermissionManageDepartment',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'manageEmployee',
        msgkey: 'Admin_Lbl_PermissionManageEmployee',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'manageCalendar',
        msgkey: 'Admin_Lbl_PermissionManageCalendar',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'manageJobType',
        msgkey: 'Admin_Lbl_PermissionManageJobType',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'manageJob',
        msgkey: 'Admin_Lbl_PermissionManageJob',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'managePermission',
        msgkey: 'Admin_Lbl_PermissionManagePermission',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'manageMobileSetting',
        msgkey: 'Admin_Lbl_PermissionManageMobileSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'managePlannerSetting',
        msgkey: 'Admin_Lbl_PermissionManagePlannerSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'usePlanner',
      },
      {
        key: 'manageAttLeave',
        msgkey: 'Admin_Lbl_PermissionManageAttLeave',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'manageAttPattern',
        msgkey: 'Admin_Lbl_PermissionManageAttPattern',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'manageAttShortTimeWorkSetting',
        msgkey: 'Admin_Lbl_PermissionManageAttShortTimeWorkSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'manageAttLeaveOfAbsence',
        msgkey: 'Admin_Lbl_PermissionManageAttLeaveOfAbsence',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'manageAttWorkingType',
        msgkey: 'Admin_Lbl_PermissionManageAttWorkingType',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'manageAttAgreementAlertSetting',
        msgkey: 'Admin_Lbl_PermissionManageAttAgreementAlertSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'manageAttLeaveGrant',
        msgkey: 'Admin_Lbl_PermissionManageAttLeaveGrant',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'manageAttPatternApply',
        msgkey: 'Admin_Lbl_PermissionManageAttPatternApply',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'manageAttShortTimeWorkSettingApply',
        msgkey: 'Admin_Lbl_PermissionManageAttShortTimeWorkSettingApply',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'manageAttLeaveOfAbsenceApply',
        msgkey: 'Admin_Lbl_PermissionManageAttLeaveOfAbsenceApply',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useAttendance',
      },
      {
        key: 'manageTimeSetting',
        msgkey: 'Admin_Lbl_PermissionManageTimeSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useWorkTime',
      },
      {
        key: 'manageTimeWorkCategory',
        msgkey: 'Admin_Lbl_PermissionManageTimeWorkCategory',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useWorkTime',
      },
      {
        key: 'manageTimeRecordItemImport',
        msgkey: 'Admin_Lbl_PermissionManageTimeRecordItemImport',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useWorkTime',
      },
      {
        key: 'manageExpTypeGroup',
        msgkey: 'Admin_Lbl_ExpTypeGroup',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageExpenseType',
        msgkey: 'Exp_Lbl_ExpenseType',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageTaxType',
        msgkey: 'Admin_Lbl_ExpTaxType',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageExpSetting',
        msgkey: 'Admin_Lbl_ExpSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageExchangeRate',
        msgkey: 'Exp_Lbl_ExchangeRate',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageAccountingPeriod',
        msgkey: 'Exp_Lbl_AccountingPeriod',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageReportType',
        msgkey: 'Exp_Lbl_ReportType',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageCostCenter',
        msgkey: 'Admin_Lbl_CostCenter',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageVendor',
        msgkey: 'Admin_Lbl_Vendor',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageExtendedItem',
        msgkey: 'Admin_Lbl_ExtendedItem',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageEmployeeGroup',
        msgkey: 'Admin_Lbl_Group',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageExpCustomHint',
        msgkey: 'Admin_Lbl_ExpCustomHint',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'manageExpCreditCard',
        msgkey: 'Admin_Lbl_ExpCreditCard',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'useExpense',
      },
      {
        key: 'managePsaSetting',
        msgkey: 'Admin_Lbl_PermissionManagePsaSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'usePsa',
      },
      {
        key: 'managePsaJobGrade',
        msgkey: 'Admin_Lbl_PermissionManageJobGrade',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'usePsa',
      },
      // PSA Extended Item
      {
        key: 'managePsaExtendedItem',
        msgkey: 'Admin_Lbl_PermissionManagePsaExtendedItem',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'usePsa',
      },
      // Group Management
      {
        key: 'managePsaGroup',
        msgkey: 'Admin_Lbl_PermissionManagePsaGroup',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'usePsa',
      }, // Skillset Management
      {
        key: 'managePsaSkillset',
        msgkey: 'Admin_Lbl_PermissionManageSkillset',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        useFunction: 'usePsa',
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
