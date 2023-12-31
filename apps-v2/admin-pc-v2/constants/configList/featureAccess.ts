import displayType from '@admin-pc/constants/displayType';
import fieldType from '@admin-pc/constants/fieldType';
import {
  options,
  PRODUCT_CATEGORY,
  scopeOfDelegatedUsersOperation,
} from '@admin-pc-v2/constants/fieldValues/featureAccessModule';
import fieldSize from '@apps/admin-pc/constants/fieldSize';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

const { FIELD_TEXT, FIELD_HIDDEN, FIELD_SELECT, FIELD_CHECKBOX } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const isTargetProduct = (baseValueGetter, product) =>
  baseValueGetter('product') === product;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
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
    maxLength: 80,
  },
  {
    key: 'product',
    msgkey: 'Admin_Lbl_Module',
    enableMode: 'new',
    type: FIELD_SELECT,
    options,
    isRequired: true,
    multiLanguageValue: true,
  },
  {
    section: `${PRODUCT_CATEGORY.COMMON}_management`,
    msgkey: 'Admin_Lbl_PermissionManagement',
    isExpandable: false,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.COMMON),
    configList: [
      {
        key: 'ManageOverallSetting',
        msgkey: 'Admin_Lbl_PermissionManageOverallSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'SwitchCompany',
        msgkey: 'Admin_Lbl_PermissionSwitchCompany',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageDepartment',
        msgkey: 'Admin_Lbl_PermissionManageDepartment',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageEmployee',
        msgkey: 'Admin_Lbl_PermissionManageEmployee',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'ManageJob',
        msgkey: 'Admin_Lbl_PermissionManageJob',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageJobType',
        msgkey: 'Admin_Lbl_PermissionManageJobType',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManagePermission',
        msgkey: 'Admin_Lbl_PermissionManagePermission',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageOrgHierarchyPattern',
        msgkey: 'Admin_Lbl_OrganizationHierarchyPattern',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManagePosition',
        msgkey: 'Admin_Lbl_Position',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageRecordAccessStandardSetting',
        msgkey: 'Admin_Lbl_StandardRecordAccess',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageRecordAccessPrivilegeSetting',
        msgkey: 'Admin_Lbl_PrivilegeRecordAccess',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageRecordAccessGrant',
        msgkey: 'Admin_Lbl_GrantRecordAccess',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageApproverSetting',
        msgkey: 'Admin_Lbl_ApproverSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageApproverGroupSetting',
        msgkey: 'Admin_Lbl_ApproverGroup',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.ATTENDANCE}_management`,
    useFunction: 'useAttendance',
    msgkey: 'Admin_Lbl_PermissionManagement',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.ATTENDANCE),
    configList: [
      {
        key: 'ManageCalendar',
        msgkey: 'Admin_Lbl_PermissionManageCalendar',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageMobileSetting',
        msgkey: 'Admin_Lbl_PermissionManageMobileSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttFeatureSetting',
        msgkey: 'Admin_Lbl_PermissionManageAttFeatureSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttLeave',
        msgkey: 'Admin_Lbl_PermissionManageAttLeave',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttLeaveDetail',
        msgkey: 'Admin_Lbl_PermissionManageAttLeaveDetail',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttPattern',
        msgkey: 'Admin_Lbl_PermissionManageAttPattern',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttShortTimeWorkSetting',
        msgkey: 'Admin_Lbl_PermissionManageAttShortTimeWorkSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttLeaveOfAbsence',
        msgkey: 'Admin_Lbl_PermissionManageAttLeaveOfAbsence',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttObjectivelyEventLogSetting',
        msgkey: 'Admin_Lbl_PermissionManageAttObjectivelyEventLogSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttWorkingType',
        msgkey: 'Admin_Lbl_PermissionManageAttWorkingType',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttLegalAgreementGroup',
        msgkey: 'Admin_Lbl_PermissionManageAttLegalAgreementGroup',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttLegalAgreement',
        msgkey: 'Admin_Lbl_PermissionManageAttLegalAgreement',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttAgreementAlertSetting',
        msgkey: 'Admin_Lbl_PermissionManageAttAgreementAlertSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttAllowance',
        msgkey: 'Admin_Lbl_PermissionManageAttAllowance',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttRestReason',
        msgkey: 'Admin_Lbl_PermissionManageAttRestReason',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttLateArrivalEarlyLeaveReason',
        msgkey: 'Admin_Lbl_PermissionManageAttLateArrivalEarlyLeaveReason',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttRecordExtendedItemSet',
        msgkey: 'Admin_Lbl_PermissionManageRecordExtendedItemSet',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttExtendedItem',
        msgkey: 'Admin_Lbl_PermissionManageAttExtendedItem',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttLeaveGrant',
        msgkey: 'Admin_Lbl_PermissionManageAttLeaveGrant',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttPatternApply',
        msgkey: 'Admin_Lbl_PermissionManageAttPatternApply',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttShortTimeWorkSettingApply',
        msgkey: 'Admin_Lbl_PermissionManageAttShortTimeWorkSettingApply',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageAttLeaveOfAbsenceApply',
        msgkey: 'Admin_Lbl_PermissionManageAttLeaveOfAbsenceApply',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.ATTENDANCE}_timesheet`,
    useFunction: 'useAttendance',
    msgkey: 'Admin_Lbl_PermissionTimesheet',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.ATTENDANCE),
    configList: [
      {
        key: 'ViewAttTimeSheetByDelegate',
        msgkey: 'Admin_Lbl_PermissionTimesheetByDelegate',
        label: 'Admin_Lbl_PermissionView',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'EditAttTimeSheetByDelegate',
        label: 'Admin_Lbl_PermissionEdit',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ViewAttSummaryByEmployee',
        msgkey: 'Att_Lbl_MonthlySummaryByEmployee',
        label: 'Admin_Lbl_PermissionView',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ViewAttSummaryByDelegate',
        msgkey: 'Att_Lbl_MonthlySummaryByDelegate',
        label: 'Admin_Lbl_PermissionView',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.ATTENDANCE}_objectively_event_log`,
    useFunction: 'useAttendance',
    msgkey: 'Admin_Lbl_PermissionObjectivelyEventLog',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.ATTENDANCE),
    configList: [
      {
        key: 'SelectAttObjectivelyEventLogByEmployee',
        msgkey: 'Admin_Lbl_PermissionOwnObjectivelyEventLog',
        label: 'Admin_Lbl_PermissionCanSelectObjectivelyEventLog',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CreateDeleteAttObjectivelyEventLogByEmployee',
        label: 'Admin_Lbl_PermissionCanDeleteOrCreateObjectivelyEventLog',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'SelectAttObjectivelyEventLogByDelegate',
        msgkey: 'Admin_Lbl_PermissionOthersObjectivelyEventLog',
        label: 'Admin_Lbl_PermissionCanSelectObjectivelyEventLog',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CreateDeleteAttObjectivelyEventLogByDelegate',
        label: 'Admin_Lbl_PermissionCanDeleteOrCreateObjectivelyEventLog',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.ATTENDANCE}_daily_request`,
    useFunction: 'useAttendance',
    msgkey: 'Admin_Lbl_PermissionAttDailyRequest',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.ATTENDANCE),
    configList: [
      {
        key: 'CancelAttDailyApprovalByEmployee',
        msgkey: 'Admin_Lbl_PermissionAttRequestByEmployee',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ApproveSelfAttDailyRequestByEmployee',
        label: 'Admin_Lbl_PermissionApproveSelfAttRequestByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'SubmitAttDailyRequestByDelegate',
        msgkey: 'Admin_Lbl_PermissionAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionSubmitAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CancelAttDailyRequestByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ApproveAttDailyRequestByDelegate',
        label: 'Admin_Lbl_PermissionApproveAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CancelAttDailyApprovalByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'BulkApprovalAttDailyRequest',
        msgkey: 'Admin_Lbl_PermissionBulkApproval',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.ATTENDANCE}_agreement_request`,
    useFunction: 'useAttendance',
    msgkey: 'Admin_Lbl_AttLegalAgreementRequest',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.ATTENDANCE),
    configList: [
      {
        key: 'SubmitAttLegalAgreementRequestByEmployee',
        msgkey: 'Admin_Lbl_PermissionAttRequestByEmployee',
        label: 'Admin_Lbl_SubmitAttLegalAgreementRequestByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CancelAttLegalAgreementRequestApprovalByEmployee',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ApproveSelfAttLegalAgreementRequestByEmployee',
        label: 'Admin_Lbl_PermissionSelfAttRequestByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'SubmitAttLegalAgreementRequestByDelegate',
        msgkey: 'Admin_Lbl_PermissionAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionSubmitAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CancelAttLegalAgreementRequestByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ApproveAttLegalAgreementRequestByDelegate',
        label: 'Admin_Lbl_PermissionApproveAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CancelAttLegalAgreementRequestApprovalByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'BulkApprovalAttLegalAgreementRequest',
        msgkey: 'Admin_Lbl_PermissionBulkApproval',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.ATTENDANCE}_monthly_request`,
    useFunction: 'useAttendance',
    msgkey: 'Admin_Lbl_PermissionAttMonthlyRequest',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.ATTENDANCE),
    configList: [
      {
        key: 'CancelAttApprovalByEmployee',
        msgkey: 'Admin_Lbl_PermissionAttRequestByEmployee',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ApproveSelfAttRequestByEmployee',
        label: 'Admin_Lbl_PermissionApproveSelfAttRequestByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'SubmitAttRequestByDelegate',
        msgkey: 'Admin_Lbl_PermissionAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionSubmitAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CancelAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ApproveAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionApproveAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CancelAttApprovalByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'BulkApprovalAttRequest',
        msgkey: 'Admin_Lbl_PermissionBulkApproval',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.ATTENDANCE}_permission_view_approval`,
    useFunction: 'useAttendance',
    msgkey: 'Admin_Lbl_PermissionViewApproval',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.ATTENDANCE),
    configList: [
      {
        key: 'ViewAttDailyRequestApproval',
        msgkey: 'Appr_Lbl_AttendanceRequest',
        label: 'Admin_Lbl_Display',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ViewAttLegalAgreementRequestApproval',
        msgkey: 'Admin_Lbl_AttLegalAgreementRequest',
        label: 'Admin_Lbl_Display',
        class: 'legal-agreement__show-left-item',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ViewAttFixDailyRequestApproval',
        msgkey: 'Appr_Lbl_DailyFixRequest',
        label: 'Admin_Lbl_Display',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ViewAttRequestApproval',
        msgkey: 'Appr_Lbl_MonthlyFixRequest',
        label: 'Admin_Lbl_Display',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.ATTENDANCE}_common_attendance_request_settings`,
    useFunction: 'useAttendance',
    msgkey: 'Admin_Lbl_CommonAttendanceRequestSettings',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.ATTENDANCE),
    configList: [
      {
        key: 'ViewNextApproverByEmployee',
        msgkey: 'Admin_Lbl_OwnNextApprover',
        label: 'Admin_Lbl_Display',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ViewNextApproverByDelegate',
        msgkey: 'Admin_Lbl_OthersNextApprover',
        label: 'Admin_Lbl_Display',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ApproveAccessibleUserAndApproverAttRequestByDelegate',
        msgkey: 'Admin_Lbl_ScopeOfDelegatedUsersOperation',
        type: FIELD_SELECT,
        size: fieldSize.SIZE_LARGE,
        options: scopeOfDelegatedUsersOperation,
        isRequired: true,
        multiLanguageValue: true,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ApproveAccessibleUserAttRequestByDelegate',
        type: FIELD_HIDDEN,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.ATTENDANCE}_timesheet_import`,
    useFunction: 'useAttendance',
    msgkey: 'Admin_Lbl_PermissionTimesheetImport',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.ATTENDANCE),
    configList: [
      {
        key: 'UseAttTimesheetImport',
        label: 'Admin_Lbl_PermissionCanUseTimesheetImport',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.ATTENDANCE}_shift_management`,
    useFunction: 'useAttendance',
    msgkey: 'Admin_Lbl_PermissionShiftManagement',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.ATTENDANCE),
    configList: [
      {
        key: 'UseAttShiftManagement',
        label: 'Admin_Lbl_PermissionCanUseShiftManagement',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.TIME_TRACKING}_management`,
    useFunction: 'useWorkTime',
    msgkey: 'Admin_Lbl_PermissionManagement',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.TIME_TRACKING),
    configList: [
      {
        key: 'ManagePlannerSetting',
        msgkey: 'Admin_Lbl_PermissionManagePlannerSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageTimeSetting',
        msgkey: 'Admin_Lbl_PermissionManageTimeSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageTimeWorkCategory',
        msgkey: 'Admin_Lbl_PermissionManageTimeWorkCategory',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.TIME_TRACKING}_time_tracking`,
    useFunction: 'useWorkTime',
    msgkey: 'Admin_Lbl_PermissionTimeTrack',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.TIME_TRACKING),
    configList: [
      {
        key: 'ViewTimeTrackByDelegate',
        msgkey: 'Admin_Lbl_PermissionTimeTrackByDelegate',
        label: 'Admin_Lbl_PermissionView',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'EditTimeTrackByDelegate',
        label: 'Admin_Lbl_PermissionEdit',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.TIME_TRACKING}_time_report`,
    useFunction: 'useWorkTime',
    msgkey: 'Admin_Lbl_PermissionTimeTrackRequest',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.TIME_TRACKING),
    configList: [
      {
        key: 'CancelTimeApprovalByEmployee',
        msgkey: 'Admin_Lbl_PermissionAttRequestByEmployee',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByEmployee',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'SubmitTimeRequestByDelegate',
        msgkey: 'Admin_Lbl_PermissionAttRequestByDelegate',
        label: 'Admin_Lbl_PermissionSubmitAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CancelTimeRequestByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttRequestByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'CancelTimeApprovalByDelegate',
        label: 'Admin_Lbl_PermissionCancelAttApprovalByDelegate',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.EXPENSE}_management`,
    useFunction: 'useExpense',
    msgkey: 'Admin_Lbl_PermissionManagement',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.EXPENSE),
    configList: [
      {
        key: 'ManageExpTypeGroup',
        msgkey: 'Admin_Lbl_ExpTypeGroup',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpType',
        msgkey: 'Exp_Lbl_ExpenseType',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpTaxType',
        msgkey: 'Admin_Lbl_ExpTaxType',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpSetting',
        msgkey: 'Admin_Lbl_ExpSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpExchangeRate',
        msgkey: 'Exp_Lbl_ExchangeRate',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpAccountingPeriod',
        msgkey: 'Exp_Lbl_AccountingPeriod',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpReportType',
        msgkey: 'Exp_Lbl_ReportType',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpCostCenter',
        msgkey: 'Admin_Lbl_CostCenter',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpVendor',
        msgkey: 'Admin_Lbl_Vendor',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpMileageRate',
        msgkey: 'Admin_Lbl_MileageRate',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpExtendedItem',
        msgkey: 'Admin_Lbl_ExtendedItem',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpEmployeeGroup',
        msgkey: 'Admin_Lbl_Group',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpCustomHint',
        msgkey: 'Admin_Lbl_ExpCustomHint',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpPaymentMethod',
        msgkey: 'Admin_Lbl_ExpPaymentMethod',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManageExpCreditCard',
        msgkey: 'Admin_Lbl_ExpCreditCard',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.EXPENSE}_expense`,
    useFunction: 'useExpense',
    msgkey: 'Admin_Lbl_EmpSectExpenseRequest',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.EXPENSE),
    configList: [
      {
        key: 'CreateExpRecordFromIcCardTxn',
        msgkey: 'Exp_Lbl_CreateRecordFromIcCard',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'UsePersonalVendor',
        msgkey: 'Admin_Lbl_PermissionPersonalVendor',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.EXPENSE}_approval`,
    useFunction: 'useExpense',
    msgkey: 'Admin_Lbl_Approval',
    isExpandable: true,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.EXPENSE),
    configList: [
      {
        key: 'ApproveExpRequestInDiffCompany',
        msgkey: 'Admin_Lbl_PermissionExpCrossCompaniesApproval',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'BulkApprovalRejectExpense',
        msgkey: 'Admin_Lbl_PermissionBulkApprovalReject',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: `${PRODUCT_CATEGORY.PSA}_management`,
    useFunction: 'usePsa',
    msgkey: 'Admin_Lbl_PermissionManagement',
    isExpandable: false,
    condition: (baseValueGetter) =>
      isTargetProduct(baseValueGetter, PRODUCT_CATEGORY.PSA),
    configList: [
      {
        key: 'ManagePsaSetting',
        msgkey: 'Admin_Lbl_PermissionManagePsaSetting',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManagePsaCustomHint',
        msgkey: 'Admin_Lbl_PermissionManagePsaCustomHint',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManagePsaJobGrade',
        msgkey: 'Admin_Lbl_PermissionManageJobGrade',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManagePsaGroup',
        msgkey: 'Admin_Lbl_PermissionManagePsaGroup',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManagePsaTalentManagement',
        msgkey: 'Admin_Lbl_PsaTalentManagement',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManagePsaFinanceCategory',
        msgkey: 'Admin_Lbl_PermissionManagePsaFinance',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManagePsaExtendedItem',
        msgkey: 'Admin_Lbl_PermissionManagePsaExtendedItem',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManagePsaBatchJob',
        msgkey: 'Admin_Lbl_PermissionManagePsaBatchJob',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'ManagePsaWorkManagement',
        msgkey: 'Admin_Lbl_PermissionManagePsaWorkManagement',
        label: 'Admin_Lbl_PermissionAvailable',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
