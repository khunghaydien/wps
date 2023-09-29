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
   * 休暇の管理
   */
  manageAttLeave: boolean;

  /**
   * 短時間勤務設定の管理
   */
  manageAttShortTimeWorkSetting: boolean;

  /**
   * 休職・休業の管理
   */
  manageAttLeaveOfAbsence: boolean;

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
   * 残業警告設定の管理
   */
  manageAttAgreementAlertSetting: boolean;

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
   * 工数実績インポートの管理
   */
  manageTimeRecordItemImport: boolean;

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
  manageExpCreditCard: boolean;
  managePsaSetting: boolean;
  managePsaJobGrade: boolean;
  managePsaSkillset: boolean;
  managePsaExtendedItem: boolean;
  managePsaGroup: boolean;
};

/**
 * 権限
 */
export type Permission = AttTransactionPermission &
  TimeTrackTransactionPermission &
  AttDailyRequestPermission &
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

  viewTimeTrackByDelegate: false,
  editTimeTrackByDelegate: false,

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

  manageOverallSetting: false,
  switchCompany: false,
  manageDepartment: false,
  manageEmployee: false,
  manageCalendar: false,
  manageJobType: false,
  manageJob: false,
  manageMobileSetting: false,
  managePermission: false,
  managePlannerSetting: false,
  manageAttLeave: false,
  manageAttShortTimeWorkSetting: false,
  manageAttLeaveOfAbsence: false,
  manageAttWorkingType: false,
  manageAttPattern: false,
  manageAttAgreementAlertSetting: false,
  manageAttLeaveGrant: false,
  manageAttShortTimeWorkSettingApply: false,
  manageAttLeaveOfAbsenceApply: false,
  manageAttPatternApply: false,
  manageAttShortTimeSettingApply: false,
  manageTimeSetting: false,
  manageTimeWorkCategory: false,
  manageTimeRecordItemImport: false,
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
  manageExpCreditCard: false,
  managePsaSetting: false,
  managePsaJobGrade: false,
  managePsaSkillset: false,
  managePsaExtendedItem: false,
  managePsaGroup: false,

  canBulkApproveAttRequest: false,
  canBulkApproveAttDailyRequest: false,
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
