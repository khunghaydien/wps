import isNil from 'lodash/isNil';
import { $Keys } from 'utility-types';

import { UserSetting } from '../UserSetting';

/**
 * 勤怠トランザクション系権限
 */
type AttTransactionPermission = {
  /**
   * 勤務表表示(代理)
   */
  viewAttTimeSheetByDelegate: boolean;

  /**
   * 勤務表編集(代理)
   */
  editAttTimeSheetByDelegate: boolean;

  /**
   * 日別客観情報ログ設定
   */
  selectAttObjectivelyEventLogByEmployee: boolean;

  /**
   * 客観情報ログ編集
   */
  createDeleteAttObjectivelyEventLogByEmployee: boolean;

  /**
   * 日別客観情報ログ設定（代理）
   */
  selectAttObjectivelyEventLogByDelegate: boolean;

  /**
   * 客観情報ログ編集（代理）
   */
  createDeleteAttObjectivelyEventLogByDelegate: boolean;

  /**
   * 社員自身の勤怠サマリー
   */
  viewAttSummaryByEmployee: boolean;

  /**
   * 他社員の勤怠サマリー(代理)
   */
  viewAttSummaryByDelegate: boolean;

  /**
   * 勤務表一括登録
   */
  useAttTimesheetImport: boolean;
};

/**
 * 工数トランザクション系権限
 */
type TimeTrackTransactionPermission = {
  /**
   * 工数実績表示(代理)
   */
  viewTimeTrackByDelegate: boolean;

  /**
   * 工数実績編集(代理)
   */
  editTimeTrackByDelegate: boolean;
};

/**
 * 勤怠申請共通設定
 */
type AttCommonPermission = {
  /**
   * 社員自身の申請の次の承認者
   */
  viewNextApproverByEmployee: boolean;

  /**
   * 他社員の申請の次の承認者
   */
  viewNextApproverByDelegate: boolean;
};

/**
 * 各種申請系権限
 */
type AttDailyRequestPermission = {
  /**
   * 各種勤怠申請申請・申請削除(代理)
   */
  submitAttDailyRequestByDelegate: boolean;

  /**
   * 各種勤怠申請申請取消(代理)
   */
  cancelAttDailyRequestByDelegate: boolean;

  /**
   * 各種勤怠申請承認却下(代理)
   */
  approveAttDailyRequestByDelegate: boolean;

  /**
   * 各種勤怠申請承認取消(本人)
   */
  cancelAttDailyApprovalByEmployee: boolean;

  /**
   * 各種勤怠申請承認取消(代理)
   */
  cancelAttDailyApprovalByDelegate: boolean;

  /**
   * 各種勤怠申請自己承認（本人）
   */
  approveSelfAttDailyRequestByEmployee: boolean;

  /**
   * 勤務確定申請申請(代理)
   */
  submitAttRequestByDelegate: boolean;

  /**
   * 勤務確定申請申請取消(代理)
   */
  cancelAttRequestByDelegate: boolean;

  /**
   * 勤務確定申請承認却下(代理)
   */
  approveAttRequestByDelegate: boolean;

  /**
   * 勤務確定申請承認取消(本人)
   */
  cancelAttApprovalByEmployee: boolean;

  /**
   * 勤務確定申請承認取消(代理)
   */
  cancelAttApprovalByDelegate: boolean;

  /**
   * 勤務確定申請自己承認（本人）
   */
  approveSelfAttRequestByEmployee: boolean;

  /**
   * Permission for bulk Approval in Attendance Daily
   */
  canBulkApproveAttDailyRequest: boolean;

  /**
   * Permission for bulk Approval in Attendance Monthly
   */
  canBulkApproveAttRequest: boolean;

  /**
   * Permission for bulk Approval in 36 AttLegalAgreement
   */
  bulkApprovalAttLegalAgreementRequest: boolean;
};

/**
 * 36協定延長申請権限
 */
type AttLegalAgreementRequestPermission = {
  /**
   * 36協定延長申請で申請できる（本人）
   */
  submitAttLegalAgreementRequestByEmployee: boolean;

  /**
   * 36協定延長申請で承認取消できる（本人）
   */
  cancelAttLegalAgreementRequestApprovalByEmployee: boolean;

  /**
   * 36協定延長申請代理で自身を承認者として申請できる（本人）
   */
  approveSelfAttLegalAgreementRequestByEmployee: boolean;

  /**
   * 36協定延長申請代理で申請できる(代理)
   */
  submitAttLegalAgreementRequestByDelegate: boolean;

  /**
   * 36協定延長申請代理で申請取消できる(代理)
   */
  cancelAttLegalAgreementRequestByDelegate: boolean;

  /**
   * 36協定延長申請代理で承認・却下できる(代理)
   */
  approveAttLegalAgreementRequestByDelegate: boolean;

  /**
   * 36協定延長申請代理で承認取消できる(代理)
   */
  cancelAttLegalAgreementRequestApprovalByDelegate: boolean;
};

/**
 * Permission set of the request of time tracking
 */
type TimeTrackRequestPermission = {
  /**
   * Permission for submitting request as delegated user
   */
  submitTimeRequestByDelegate: boolean;

  /**
   * Permission for recalling submitted request as delegated user
   */
  cancelTimeRequestByDelegate: boolean;

  /**
   * Permission for recalling approved request as employee themself
   */
  cancelTimeApprovalByEmployee: boolean;

  /**
   * Permission for recalling approved request as delegated user
   */
  cancelTimeApprovalByDelegate: boolean;
};

/**
 * 管理系権限
 */
type ManagementPermission = {
  /**
   * 全体設定の管理
   */
  manageOverallSetting: boolean;

  /**
   * 会社の切り替え
   */
  switchCompany: boolean;

  manageApproverSetting: boolean;

  /**
   * 部署の管理
   */
  manageDepartment: boolean;

  /**
   * 社員の管理
   */
  manageEmployee: boolean;

  /**
   * カレンダーの管理
   */
  manageCalendar: boolean;

  /**
   * ジョブタイプの管理
   */
  manageJobType: boolean;

  /**
   * ジョブの管理
   */
  manageJob: boolean;

  /**
   * モバイル機能設定の管理
   */
  manageMobileSetting: boolean;

  /**
   * アクセス権限設定の管理
   */
  managePermission: boolean;

  /**
   * プランナー機能設定の管理
   */
  managePlannerSetting: boolean;

  /**
   * 勤怠機能設定の管理
   */
  manageAttFeatureSetting: boolean;

  /**
   * 休暇の管理
   */
  manageAttLeave: boolean;

  /** 休暇内訳の管理 */
  manageAttLeaveDetail: boolean;

  /**
   * 短時間勤務設定の管理
   */
  manageAttShortTimeWorkSetting: boolean;

  /**
   * 休職・休業の管理
   */
  manageAttLeaveOfAbsence: boolean;

  /**
   * 客観情報ログの管理
   */
  manageAttObjectivelyEventLogSetting: boolean;

  /**
   * 勤務体系の管理
   */
  manageAttWorkingType: boolean;

  /**
   * 勤務パターンの管理
   */
  manageAttPattern: boolean;

  /**
   * 勤務パターン適用の管理
   */
  manageAttPatternApply: boolean;

  /**
   * 労使協定グループの管理
   */
  manageAttLegalAgreementGroup: boolean;

  /**
   * 労使協定・健康管理の管理
   */
  manageAttLegalAgreement: boolean;

  /**
   * 残業警告設定の管理
   */
  manageAttAgreementAlertSetting: boolean;

  /**
   * 手当の管理
   */
  manageAttAllowance: boolean;

  /**
   * 休憩理由の管理
   */
  manageAttRestReason: boolean;

  /**
   * 遅刻早退理由の管理
   */
  manageAttLateArrivalEarlyLeaveReason: boolean;

  /**
   * 勤怠明細拡張項目定義セット
   */
  manageAttRecordExtendedItemSet: boolean;

  /**
   * 勤怠拡張項目定義の管理
   */
  manageAttExtendedItem: boolean;

  /**
   * 休暇管理の管理
   */
  manageAttLeaveGrant: boolean;

  /**
   * 短時間勤務設定適用の管理
   */
  manageAttShortTimeWorkSettingApply: boolean;

  /**
   * 休職・休業適用の管理
   */
  manageAttLeaveOfAbsenceApply: boolean;

  /**
   * 工数設定の管理
   */
  manageTimeSetting: boolean;

  /**
   * 作業分類の管理
   */
  manageTimeWorkCategory: boolean;

  /**
   * Position Admin Screen
   */
  managePosition: boolean;

  /**
   * Organization Admin Screen
   */
  manageOrgHPattern: boolean;

  manageAttShortTimeSettingApply: boolean;

  manageExpTypeGroup: boolean;
  manageExpenseType: boolean;
  manageTaxType: boolean;
  manageExpSetting: boolean;
  manageExchangeRate: boolean;
  manageAccountingPeriod: boolean;
  manageReportType: boolean;
  manageCostCenter: boolean;
  manageVendor: boolean;
  manageExtendedItem: boolean;
  manageEmployeeGroup: boolean;
  manageExpCustomHint: boolean;
  manageExpPaymentMethod: boolean;
  manageExpCreditCard: boolean;
  manageExpMileageRate: boolean;
  managePsaSetting: boolean;
  managePsaCustomHint: boolean;
  managePsaJobGrade: boolean;
  managePsaExtendedItem: boolean;
  managePsaFinanceCategory: boolean;
  managePsaGroup: boolean;
  managePsaTalentManagement: boolean;
  managePsaBatchJob: boolean;
  managePsaWorkManagement: boolean;
  manageRecordAccessStandardSetting: boolean;
  manageRecordAccessPrivilegeSetting: boolean;
  manageRecordAccessGrant: boolean;
  manageApproverGroupSetting: boolean;
};

/**
 * 権限
 */
export type Permission = AttTransactionPermission &
  TimeTrackTransactionPermission &
  AttCommonPermission &
  AttDailyRequestPermission &
  AttLegalAgreementRequestPermission &
  TimeTrackRequestPermission &
  ManagementPermission;

export type DynamicTestConditions = {
  allowIfByDelegate?: boolean;
  requireIfByDelegate?: $Keys<Permission>[];
  allowIfByEmployee?: boolean;
  requireIfByEmployee?: $Keys<Permission>[];
};

/**
 * @param allowIfByDelegate "Functions permitted when performing delegate operations: true", "Functions not permitted when performing delegate operations: false"
 * @param requireIfByDelegate Set Access Permission for functions that can be used during delegate operations.
 * @param allowIfByEmployee "Functions permitted when performing employee operations: true", "Functions not permitted when performing employee operations: false"
 * @param requireIfByEmployee Set Access Permission for functions that can be used during employee operations.
 *
 * @example
 *  // This type is mainly used for AccessControl.
 *  // The following code is an example of a component that can be operated by the user who is operating the user or who has 'submitAttDailyRequestByDelegate' access.
 *  <AccessControl
 *   allowIfByEmployee
 *   requireIfByDelegate={['submitAttDailyRequestByDelegate']}
 *  >
 *    // The component that allows the operation.
 *  </AccessControl>
 */
export type TotalTestConditions = {
  allowIfByDelegate?: boolean;
  requireIfByDelegate?: $Keys<Permission>[];
  allowIfByEmployee?: boolean;
  requireIfByEmployee?: $Keys<Permission>[];
  userPermission: Permission;
  isByDelegate: boolean;
};

const defaultPermission: Permission = {
  viewAttTimeSheetByDelegate: false,
  editAttTimeSheetByDelegate: false,

  selectAttObjectivelyEventLogByEmployee: false,
  selectAttObjectivelyEventLogByDelegate: false,

  createDeleteAttObjectivelyEventLogByEmployee: false,
  createDeleteAttObjectivelyEventLogByDelegate: false,

  viewAttSummaryByEmployee: false,
  viewAttSummaryByDelegate: false,

  viewTimeTrackByDelegate: false,
  editTimeTrackByDelegate: false,

  viewNextApproverByEmployee: false,
  viewNextApproverByDelegate: false,

  submitAttDailyRequestByDelegate: false,
  cancelAttDailyRequestByDelegate: false,
  approveSelfAttDailyRequestByEmployee: false,
  approveAttDailyRequestByDelegate: false,
  cancelAttDailyApprovalByEmployee: false,
  cancelAttDailyApprovalByDelegate: false,
  approveSelfAttRequestByEmployee: false,

  submitAttRequestByDelegate: false,
  cancelAttRequestByDelegate: false,
  approveAttRequestByDelegate: false,
  cancelAttApprovalByEmployee: false,
  cancelAttApprovalByDelegate: false,

  submitTimeRequestByDelegate: false,
  cancelTimeRequestByDelegate: false,
  cancelTimeApprovalByEmployee: false,
  cancelTimeApprovalByDelegate: false,

  submitAttLegalAgreementRequestByEmployee: false,
  cancelAttLegalAgreementRequestApprovalByEmployee: false,
  approveSelfAttLegalAgreementRequestByEmployee: false,
  submitAttLegalAgreementRequestByDelegate: false,
  cancelAttLegalAgreementRequestByDelegate: false,
  approveAttLegalAgreementRequestByDelegate: false,
  cancelAttLegalAgreementRequestApprovalByDelegate: false,

  useAttTimesheetImport: false,

  manageOverallSetting: false,
  switchCompany: false,
  manageApproverSetting: false,
  manageDepartment: false,
  manageEmployee: false,
  manageCalendar: false,
  manageJobType: false,
  manageJob: false,
  manageMobileSetting: false,
  managePermission: false,
  managePlannerSetting: false,
  manageAttFeatureSetting: false,
  manageAttLeave: false,
  manageAttLeaveDetail: false,
  manageAttShortTimeWorkSetting: false,
  manageAttLeaveOfAbsence: false,
  manageAttWorkingType: false,
  manageAttPattern: false,
  manageAttLegalAgreementGroup: false,
  manageAttLegalAgreement: false,
  manageAttAgreementAlertSetting: false,
  manageAttAllowance: false,
  manageAttRestReason: false,
  manageAttRecordExtendedItemSet: false,
  manageAttLateArrivalEarlyLeaveReason: false,
  manageAttExtendedItem: false,
  manageAttLeaveGrant: false,
  manageAttShortTimeWorkSettingApply: false,
  manageAttObjectivelyEventLogSetting: false,
  manageAttLeaveOfAbsenceApply: false,
  manageAttPatternApply: false,
  manageAttShortTimeSettingApply: false,
  manageTimeSetting: false,
  manageTimeWorkCategory: false,
  managePosition: false,
  manageOrgHPattern: false,

  manageExpTypeGroup: false,
  manageExpenseType: false,
  manageTaxType: false,
  manageExpSetting: false,
  manageExchangeRate: false,
  manageAccountingPeriod: false,
  manageReportType: false,
  manageCostCenter: false,
  manageVendor: false,
  manageExtendedItem: false,
  manageEmployeeGroup: false,
  manageExpCustomHint: false,
  manageExpPaymentMethod: false,
  manageExpCreditCard: false,
  manageExpMileageRate: false,
  managePsaSetting: false,
  managePsaBatchJob: false,
  managePsaWorkManagement: false,
  managePsaCustomHint: false,
  managePsaJobGrade: false,
  managePsaExtendedItem: false,
  managePsaFinanceCategory: false,
  managePsaGroup: false,
  managePsaTalentManagement: false,
  manageRecordAccessStandardSetting: false,
  manageRecordAccessGrant: false,
  manageRecordAccessPrivilegeSetting: false,
  manageApproverGroupSetting: false,

  canBulkApproveAttRequest: false,
  canBulkApproveAttDailyRequest: false,
  bulkApprovalAttLegalAgreementRequest: false,
};

const hasAllowedPermission = (
  userPermission: Permission,
  allowedPermissions: $Keys<Permission>[]
) => allowedPermissions.some((permission) => userPermission[permission]);

export const buildCheckerByUserPermission =
  (userPermission: Permission) => (allowedPermissions: $Keys<Permission>[]) =>
    hasAllowedPermission(userPermission, allowedPermissions);

const isValidParameters = (conditions: TotalTestConditions) => {
  return !(
    isNil(conditions.requireIfByEmployee) &&
    isNil(conditions.requireIfByDelegate) &&
    isNil(conditions.allowIfByEmployee) &&
    isNil(conditions.allowIfByDelegate)
  );
};

export const isPermissionSatisfied = (conditions: TotalTestConditions) => {
  if (!isValidParameters(conditions)) {
    throw new Error('No permissions are specified.');
  }

  const hasPermission = (required: $Keys<Permission>[]) =>
    hasAllowedPermission(conditions.userPermission, required);

  return conditions.isByDelegate
    ? conditions.allowIfByDelegate ||
        (conditions.requireIfByDelegate &&
          hasPermission(conditions.requireIfByDelegate)) ||
        false
    : conditions.allowIfByEmployee ||
        (conditions.requireIfByEmployee &&
          hasPermission(conditions.requireIfByEmployee)) ||
        false;
};

export const isAvailableTimeTrack = (
  userPermission: Permission,
  userSetting: UserSetting,
  isDelegated = false
): boolean => {
  if (isDelegated) {
    const hasDelegatePermission = isPermissionSatisfied({
      userPermission,
      requireIfByDelegate: ['viewTimeTrackByDelegate'],
      allowIfByEmployee: true,
      isByDelegate: true,
    });

    return userSetting.useWorkTime && hasDelegatePermission;
  } else {
    return userSetting.useWorkTime;
  }
};

export default defaultPermission;
