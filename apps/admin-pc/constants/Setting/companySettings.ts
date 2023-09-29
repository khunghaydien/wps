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
            // 休暇
            key: 'Leave',
            name: 'Admin_Lbl_Leave',
            requiredPermission: ['manageAttLeave'],
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
            // 勤務体系
            key: 'WorkScheme',
            name: 'Admin_Lbl_WorkScheme',
            requiredPermission: ['manageAttWorkingType'],
          },
          {
            // Agreement Alert Settings (残業警告設定)
            key: 'AgreementAlertSetting',
            name: 'Admin_Lbl_AgreementAlertSetting',
            requiredPermission: ['manageAttAgreementAlertSetting'],
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
          },
          //          {
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
      {
        key: 'TimeRecordItemImport',
        name: 'Admin_Lbl_TimeRecordItemImport',
        requiredPermission: ['manageTimeRecordItemImport'],
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
            key: 'PSAGroup',
            name: 'Admin_Lbl_PSAGroupLabel',
            requiredPermission: ['managePsaGroup'],
          },
          {
            key: 'ManagerList',
            name: 'Admin_Lbl_PsaManagerList',
            requiredPermission: ['managePsaGroup'],
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
        key: 'GroupType',
        name: 'Admin_Lbl_PSAGroup',
        childMenuList: [
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
        requiredPermission: ['managePsaSkillset'],
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
    ],
  },
];

export default companySettings;
