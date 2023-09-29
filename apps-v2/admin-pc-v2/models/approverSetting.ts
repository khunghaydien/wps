export type ApproverSetting = {
  companyId: string;
  requestType: keyof typeof REQUEST_TYPE_LABELS;
  approver01: string;
  approver02: string;
  approver03: string;
  approver04: string;
  approver05: string;
};

export const COMPONENT_KEY = 'approverSetting';

export const DISABLE_REQUEST_TYPE_APPROVER01 = [
  'AttDailyRequest',
  'AttFixDailyRequest',
  'AttFixRequest',
  'AttAgreementRequest',
];

export const ENABLE_COST_CENTER_MANAGER_OPTION = [
  'ExpReportRequest',
  'ExpRequestApproval',
];

export const KEY_ENABLE_COST_CENTER_MANAGER_OPTION = 'CostCenterManager';

export const REQUEST_TYPE_LABELS = {
  AttDailyRequest: 'Appr_Lbl_AttendanceRequest',
  AttFixDailyRequest: 'Appr_Lbl_DailyFixRequest',
  AttFixRequest: 'Appr_Lbl_MonthlyFixRequest',
  AttAgreementRequest: 'Appr_Lbl_LegalAgreementRequest',
  TimeRequest: 'Appr_Btn_TimeTrackRequest',
  ExpReportRequest: 'Appr_Clbl_ExpensesRequest',
  ExpRequestApproval: 'Appr_Clbl_ExpensesPreApproval',
  ComGeneralRequest: 'Com_Tab_CustomRequest',
};

export const APPROVER_OPTION_LABELS = {
  EmpApprover01: 'Admin_Lbl_ApplicantApprover01',
  EmpApprover02: 'Admin_Lbl_ApplicantApprover02',
  EmpApprover03: 'Admin_Lbl_ApplicantApprover03',
  EmpApprover04: 'Admin_Lbl_ApplicantApprover04',
  EmpApprover05: 'Admin_Lbl_ApplicantApprover05',
  EmpApprover06: 'Admin_Lbl_ApplicantApprover06',
  EmpApprover07: 'Admin_Lbl_ApplicantApprover07',
  EmpApprover08: 'Admin_Lbl_ApplicantApprover08',
  EmpApprover09: 'Admin_Lbl_ApplicantApprover09',
  EmpApprover10: 'Admin_Lbl_ApplicantApprover10',
  EmpManager: 'Admin_Lbl_ApplicantManager',
  CostCenterManager: 'Admin_Lbl_RequestCostCenterManager',
  EmpPrimaryDeptMgr: 'Admin_Lbl_ApplicantPrimaryDeptManager',
  EmpPrimaryParentDeptMgr: 'Admin_Lbl_ApplicantPrimaryParentDeptManager',
  ReqJobOwner: 'Admin_Lbl_RequestJobOwner',
  ChoiceByApplicant: 'Admin_Lbl_ChoiceByApplicant',
  NotUsed: 'Admin_Lbl_NotUsed',
};
