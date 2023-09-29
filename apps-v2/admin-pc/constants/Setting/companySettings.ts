import { MenuSetting } from './types';

const companySettings: MenuSetting = [
  {
    // 一般設定
    name: 'Admin_Lbl_Company_General',
    menuList: [
      //      { // 利用機能選択
      //        key: 'Use',
      //        name: 'Admin_Lbl_SelectFunction',
      //      },
      // 共通マスタ
      {
        key: 'Common',
        name: 'Admin_Lbl_CommonMaster',
        childMenuList: [
          {
            // 部署
            key: 'Department',
            name: 'Admin_Lbl_Department',
            requiredPermission: ['manageDepartment'],
          },
          {
            // 社員登録
            key: 'Emp',
            name: 'Admin_Lbl_Employee',
            requiredPermission: ['manageEmployee'],
          }, //          { // グレード
          //            key: 'Grade',
          //            name: 'Admin_Lbl_Grade',
          //          },
          {
            // カレンダー
            key: 'Calendar',
            name: 'Admin_Lbl_Calendar',
            requiredPermission: ['manageCalendar'],
          },
          {
            // ジョブタイプ
            key: 'JobType',
            name: 'Admin_Lbl_JobType',
            requiredPermission: ['manageJobType'],
          },
          {
            // ジョブ
            key: 'Job',
            name: 'Admin_Lbl_Job',
            requiredPermission: ['manageJob'],
          },
          {
            // アクセス権限管理
            key: 'Permission',
            name: 'Admin_Lbl_AccessPermissionManagement',
            requiredPermission: ['managePermission'],
          }, //          { // 拡張項目
          //            key: 'ExtraField',
          //            name: 'Admin_Lbl_ExtraField',
          //          },
        ],
      }, //      {
      //        key: 'AppProcess',
      //        name: 'Admin_Lbl_ApprovalProcess',
      //      },
      //      {
      //        key: 'NumberScheme',
      //        name: 'Admin_Lbl_NumberScheme',
      //      },
      {
        key: 'RecordAccess',
        name: 'Admin_Lbl_RecordAccess',
        childMenuList: [
          {
            key: 'RecordAccessStandard',
            name: 'Admin_Lbl_StandardRecordAccess',
            requiredPermission: ['manageRecordAccessStandardSetting'],
          },
          {
            key: 'RecordAccessPrivilege',
            name: 'Admin_Lbl_PrivilegeRecordAccess',
            requiredPermission: ['manageRecordAccessPrivilegeSetting'],
          },
          {
            key: 'RecordAccessGrant',
            name: 'Admin_Lbl_GrantRecordAccess',
            requiredPermission: ['manageRecordAccessGrant'],
          },
        ],
      },
      {
        key: 'Approval',
        name: 'Admin_Lbl_Approval',
        childMenuList: [
          {
            key: 'ApproverSetting',
            name: 'Admin_Lbl_ApproverSetting',
            requiredPermission: ['manageApproverSetting'],
          },
          {
            key: 'ApproverGroup',
            name: 'Admin_Lbl_ApproverGroup',
            requiredPermission: ['manageApproverGroupSetting'],
          },
        ],
      },
      {
        // モバイル
        key: 'Mobile',
        name: 'Admin_Lbl_Mobile',
        // NOTE epic/GENIE-10382
        // "Mobile" menu has an only setting for the feature of attendance.
        // If attendance feature is disabled, then the empty page just are shown.
        // Hence, at doing epic/GENIE-10382, we decided to hide "Mobile" menu
        // when "useAttendance" flag is off.
        //
        // モバイルメニューには勤怠のためだけの設定しか持っていません。
        // 勤怠機能を無効にした場合に、ただの空ページが表示されることになってしまいます。
        // したがって, epic/GENIE-10382をやる時点では勤怠機能の利用フラグがOFFの場合には
        // メニューそのものを非表示にしています。
        objectName: 'useAttendance',
        childMenuList: [
          {
            // 機能設定
            key: 'MobileSetting',
            name: 'Admin_Lbl_FunctionSettings',
            requiredPermission: ['manageMobileSetting'],
          },
        ],
      },
    ],
  },
  {
    // プランナー
    name: 'Admin_Lbl_Planner',
    objectName: 'usePlanner',
    menuList: [
      {
        key: 'PlannerSetting',
        name: 'Admin_Lbl_FunctionSettings',
        requiredPermission: ['managePlannerSetting'],
      },
    ],
  },
  {
    // 勤怠管理
    name: 'Admin_Lbl_AttendanceManagement',
    objectName: 'useAttendance',
    menuList: [
      {
        key: 'AttendanceMaster',
        name: 'Admin_Lbl_Master',
        childMenuList: [
          {
            // 勤怠機能設定
            key: 'AttendanceFeatureSetting',
            name: 'Admin_Lbl_AttFeatureSetting',
            requiredPermission: ['manageAttFeatureSetting'],
          },
          {
            // 休暇
            key: 'Leave',
            name: 'Admin_Lbl_Leave',
            requiredPermission: ['manageAttLeave'],
          },
          {
            // 休暇内訳
            key: 'LeaveDetail',
            name: '$Att_Lbl_LeaveDetail',
            requiredPermission: ['manageAttLeaveDetail'],
          },
          {
            // 勤務パターン
            key: 'AttPattern',
            name: 'Admin_Lbl_AttPattern',
            requiredPermission: ['manageAttPattern'],
          },
          {
            // 短時間勤務設定
            key: 'ShortTimeWorkSetting',
            name: 'Admin_Lbl_ShortTimeWorkSetting',
            requiredPermission: ['manageAttShortTimeWorkSetting'],
          },
          {
            // 短時間勤務理由
            key: 'ShortTimeWorkReason',
            name: 'Admin_Lbl_ShortTimeWorkReason',
            requiredPermission: ['manageAttShortTimeWorkSetting'],
          },
          {
            // 休職・休業設定
            key: 'LeaveOfAbsence',
            name: 'Admin_Lbl_LeaveOfAbsence',
            requiredPermission: ['manageAttLeaveOfAbsence'],
          },
          {
            // 客観情報ログ設定
            key: 'ObjectivelyEventLogSetting',
            name: 'Admin_Lbl_ObjectivelyEventLogSetting',
            requiredPermission: ['manageAttObjectivelyEventLogSetting'],
          },
          {
            // 勤務体系
            key: 'WorkScheme',
            name: 'Admin_Lbl_WorkScheme',
            requiredPermission: ['manageAttWorkingType'],
          },
          {
            // Legal Agreement Group (労使協定グループ)
            key: 'LegalAgreementGroup',
            name: 'Admin_Lbl_LegalAgreementGroup',
            requiredPermission: ['manageAttLegalAgreementGroup'],
          },
          {
            // 労使協定・健康管理
            key: 'LegalAgreement',
            name: 'Admin_Lbl_AttLegalAgreement',
            requiredPermission: ['manageAttLegalAgreement'],
          },
          {
            // Agreement Alert Settings (残業警告設定)
            key: 'AgreementAlertSetting',
            name: 'Admin_Lbl_AgreementAlertSetting',
            requiredPermission: ['manageAttAgreementAlertSetting'],
          },
          {
            // 手当
            key: 'AttAllowance',
            name: 'Admin_Lbl_AttAllowance',
            requiredPermission: ['manageAttAllowance'],
          },
          {
            // 休憩理由
            key: 'AttRestReason',
            name: '$Att_Lbl_RestReason',
            requiredPermission: ['manageAttRestReason'],
          },
          {
            // 遅刻早退理由
            key: 'AttLateArrivalEarlyLeaveReason',
            name: 'Admin_Lbl_AttLateArrivalEarlyLeaveReason',
            requiredPermission: ['manageAttLateArrivalEarlyLeaveReason'],
          },
          {
            // 勤怠明細拡張項目定義セット
            key: 'AttRecordExtendedItemSet',
            name: 'Att_Lbl_RecordExtendedItemSet',
            requiredPermission: ['manageAttRecordExtendedItemSet'],
          },
          {
            // 勤怠拡張項目定義
            key: 'AttExtendedItem',
            name: 'Admin_Lbl_AttExtendedItem',
            requiredPermission: ['manageAttExtendedItem'],
          },
        ],
      },
      {
        // Leave Management (休暇管理)
        key: 'LeaveManagement',
        name: 'Admin_Lbl_LeaveManagement',
        requiredPermission: ['manageAttLeaveGrant'],
        childMenuList: [
          {
            // Annual Paid Leave (年次有給休暇)
            key: 'AnnualPaidLeaveManagement',
            name: 'Att_Lbl_AnnualPaidLeave',
          },
          {
            // Managed Leave (日数管理休暇)
            key: 'ManagedLeaveManagement',
            name: 'Att_Lbl_ManagedLeave',
          },
        ],
      }, // 勤務パターン適用
      {
        key: 'AttPatternEmployeeBatch',
        name: 'Admin_Lbl_AttPatternEmployeeBatch',
        requiredPermission: ['manageAttPatternApply'],
      }, // 短時間勤務設定適用
      {
        key: 'ShortTimeWorkPeriodStatus',
        name: 'Admin_Lbl_ShortTimeWorkPeriodStatus',
        requiredPermission: ['manageAttShortTimeWorkSettingApply'],
      }, // 休職・休業適用
      {
        key: 'LeaveOfAbsencePeriodStatus',
        name: 'Admin_Lbl_LeaveOfAbsencePeriodStatus',
        requiredPermission: ['manageAttLeaveOfAbsenceApply'],
      }, // {
      //   key: 'AttSettings',
      //   name: 'Admin_Lbl_FunctionSettings',
      // },
    ],
  },
  {
    // 工数管理
    name: 'Admin_Lbl_WorkTimeManagement',
    objectName: 'useWorkTime',
    menuList: [
      {
        key: 'WorkTimeMaster',
        name: 'Admin_Lbl_Master',
        childMenuList: [
          {
            key: 'TimeSetting',
            name: 'Admin_Lbl_TimeSetting',
            requiredPermission: ['manageTimeSetting'],
          }, //          {
          //            key: 'JobInputType',
          //            name: 'Admin_Lbl_JobInputType',
          //          },
          {
            key: 'WorkCategory',
            name: 'Admin_Lbl_WorkCategory',
            requiredPermission: ['manageTimeWorkCategory'],
          },
        ],
      },
    ],
  },
  {
    // 経費申請
    name: 'Admin_Lbl_ExpenseRequest',
    objectName: 'useExpense',
    menuList: [
      {
        key: 'ExpenseMaster',
        name: 'Admin_Lbl_Master',
        childMenuList: [
          {
            key: 'ExpTypeGroup',
            name: 'Admin_Lbl_ExpTypeGroup',
            requiredPermission: ['manageExpTypeGroup'],
          },
          {
            key: 'ExpenseType',
            name: 'Exp_Lbl_ExpenseType',
            requiredPermission: ['manageExpenseType'],
          },
          {
            key: 'TaxType',
            name: 'Admin_Lbl_ExpTaxType',
            requiredPermission: ['manageTaxType'],
          },
          {
            key: 'ExpSetting',
            name: 'Admin_Lbl_ExpSetting',
            requiredPermission: ['manageExpSetting'],
          },
          {
            key: 'ExchangeRate',
            name: 'Exp_Lbl_ExchangeRate',
            requiredPermission: ['manageExchangeRate'],
          },
          {
            key: 'AccountingPeriod',
            name: 'Exp_Lbl_AccountingPeriod',
            requiredPermission: ['manageAccountingPeriod'],
          },
          {
            key: 'ReportType',
            name: 'Exp_Lbl_ReportType',
            requiredPermission: ['manageReportType'],
          },
          {
            // Cost Center
            key: 'CostCenter',
            name: 'Admin_Lbl_CostCenter',
            requiredPermission: ['manageCostCenter'],
          },
          {
            // Vendor
            key: 'Vendor',
            name: 'Admin_Lbl_Vendor',
            requiredPermission: ['manageVendor'],
          },
          {
            // 拡張項目
            key: 'ExtendedItem',
            name: 'Admin_Lbl_ExtendedItem',
            requiredPermission: ['manageExtendedItem'],
          },
          {
            // Group
            key: 'Group',
            name: 'Admin_Lbl_Group',
            requiredPermission: ['manageEmployeeGroup'],
          },
          {
            // CustomHint
            key: 'CustomHint',
            name: 'Admin_Lbl_ExpCustomHint',
            requiredPermission: ['manageExpCustomHint'],
          },
          {
            key: 'PaymentMethod',
            name: 'Admin_Lbl_ExpPaymentMethod',
            requiredPermission: ['manageExpPaymentMethod'],
          },
          {
            // CreditCard
            key: 'CreditCard',
            name: 'Admin_Lbl_ExpCreditCard',
            requiredPermission: ['manageExpCreditCard'],
          },
        ],
      },
    ],
  },
  {
    // PSA
    name: 'Admin_Lbl_Psa',
    objectName: 'usePsa',
    menuList: [
      {
        key: 'PsaMaster',
        name: 'Admin_Lbl_Master',
        childMenuList: [
          {
            key: 'PsaSettings',
            name: 'Admin_Lbl_PsaSetting',
            requiredPermission: ['managePsaSetting'],
          },
          {
            // ジョブグレード
            key: 'JobGrade',
            name: 'Admin_Lbl_JobGrade',
            requiredPermission: ['managePsaJobGrade'],
          },
          {
            // WorkScheme
            key: 'PsaWorkScheme',
            name: 'Admin_Lbl_PsaWorkScheme',
            requiredPermission: ['managePsaWorkManagement'],
          },
          {
            // WorkArrangement
            key: 'WorkArrangement',
            name: 'Admin_Lbl_WorkArrangement',
            requiredPermission: ['managePsaWorkManagement'],
          },
          {
            // CustomHint
            key: 'CustomHintPsa',
            name: 'Admin_Lbl_PsaCustomHint',
          },
        ],
      },
      {
        key: 'GroupType',
        name: 'Admin_Lbl_PSAGroup',
        childMenuList: [
          {
            key: 'ManagerList',
            name: 'Admin_Lbl_PsaManagerList',
            requiredPermission: ['managePsaGroup'],
          },
          {
            key: 'ResourceGroup',
            name: 'Admin_Lbl_ResourceGroup',
            requiredPermission: ['managePsaGroup'],
          },
          // {
          //   key: 'ProjectManagerGroup',
          //   name: 'Admin_Lbl_PMGroup',
          // },
        ],
      },
      {
        // Skillset Management (休暇管理)
        key: 'SkillsetManagement',
        name: 'Admin_Lbl_PsaTalentManagement',
        requiredPermission: ['managePsaTalentManagement'],
        childMenuList: [
          {
            key: 'Category',
            name: 'Psa_Lbl_SkillsetCategory',
          },
          {
            // スキルセット
            key: 'Skillset',
            name: 'Admin_Lbl_Skillset',
          },
          {
            key: 'TalentProfile',
            name: 'Admin_Lbl_TalentProfile',
          },
        ],
      },
      {
        key: 'Finance',
        name: 'Admin_Lbl_PsaFinance',
        childMenuList: [
          {
            key: 'FinanceCategory',
            name: 'Psa_Lbl_FinanceCategory',
            requiredPermission: ['managePsaFinanceCategory'],
          },
        ],
      },
      {
        // 拡張項目
        key: 'ExtendedItems',
        name: 'Admin_Lbl_ExtendedItem',
        requiredPermission: ['managePsaExtendedItem'],
        childMenuList: [
          {
            key: 'ExtendedItemProject',
            name: 'Admin_Lbl_Project',
          },
          {
            key: 'ExtendedItemRole',
            name: '$Psa_Clbl_ProjectRole',
          },
        ],
      },
      {
        // 運用管理
        key: 'PsaOperation',
        name: 'Admin_Lbl_PsaOperation',
        childMenuList: [
          {
            // Psa Bacth Job
            key: 'PsaBatchJob',
            name: 'Admin_Lbl_PsaBatchJob',
            requiredPermission: ['managePsaBatchJob'],
          },
        ],
      },
    ],
  },
];

export default companySettings;
