export type ProxyEmployee = {
  id: string;
  employeeCode: string;
  employeeName: string;
  employeePhotoUrl: string;
  departmentCode: string;
  departmentName: string;
  title: string;
  expPreApprovalRequestCount: number;
  expReportRequestCount: number;
  totalRequestCount: number;
};

export type ProxyEmployeeInfo = ProxyEmployee & {
  isProxyMode: boolean;
};
