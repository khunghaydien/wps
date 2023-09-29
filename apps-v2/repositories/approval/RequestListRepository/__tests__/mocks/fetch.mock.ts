import Decimal from 'decimal.js';

import {
  AttendanceDailyRequest,
  AttendanceFixRequest,
  ExpenseRequest,
  REQUEST_TYPE,
} from '@apps/domain/models/approval/request/Request';
import STATUS from '@apps/domain/models/approval/request/Status';

export const attendanceFixRequest: AttendanceFixRequest = {
  requestType: REQUEST_TYPE.ATTENDANCE_FIX,
  requestId: '00001',
  requestDate: '2022-01-01',
  subject: '勤務確定申請',
  employeeName: '申請者名',
  photoUrl: '',
  departmentName: '部署名',
  approverName: '承認者名',
  approverPhotoUrl: '',
  approverDepartmentName: '承認者部署名',
  targetMonth: '2022-01',
};

export const attendanceDailyRequest: AttendanceDailyRequest = {
  requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
  requestId: '00001',
  requestDate: '2022-01-01',
  subject: '欠勤申請',
  employeeName: '申請者名',
  photoUrl: '',
  departmentName: '部署名',
  approverName: '承認者名',
  approverPhotoUrl: '',
  approverDepartmentName: '承認者部署名',
  startDate: '2022-01-01',
  endDate: '2022-01-31',
  requestStatus: STATUS.Pending,
  originalRequestStatus: STATUS.Reapplying,
};

export const expenseRequest: ExpenseRequest = {
  requestType: REQUEST_TYPE.EXPENSE,
  requestId: '00001',
  requestDate: '2022-01-01',
  subject: '経費申請',
  employeeName: '申請者名',
  photoUrl: '',
  departmentName: '部署名',
  reportNo: 'NO-00001',
  totalAmount: new Decimal(1090),
};

export const defaultValue = [
  attendanceFixRequest,
  attendanceDailyRequest,
  expenseRequest,
];
