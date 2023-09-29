import imgPhoto from '@commons/images/Sample_photo001.png';

import {
  STATUS,
  YearlyLegalAgreementRequest,
} from '@attendance/domain/models/approval/LegalAgreementRequest';
import { WORK_SYSTEM as LEGAL_AGREEMENT_WORK_SYSTEM } from '@attendance/domain/models/LegalAgreementOvertime';
import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

export const defaultValue = {
  request: {
    id: 'id',
    status: STATUS.PENDING,
    submitter: {
      employee: {
        name: 'EmployeeName',
        code: 'EMPLOYEE_CODE',
        photoUrl: imgPhoto,
        department: {
          name: 'DepartmentName',
        },
      },
      delegator: {
        employee: {
          name: 'DelegatorEmployeeName',
        },
      },
    },
    type: CODE.YEARLY,
    typeLabel: '年間',
    yearlyOvertimeHours: 1,
    yearlyOvertimeHours1YearAgo: 2,
    specialYearlyOvertimeHours: 3,
    specialYearlyOvertimeHours1YearAgo: 4,
    overtimeHoursLimit: 5,
    changedOvertimeHoursLimit: 6,
    requestableOvertimeHoursLimit: 7,
    reason: '理由',
    measure: '対策',
  },
  originalRequest: null,
  historyList: [
    {
      id: 'id1',
      status: STATUS.PENDING,
      statusLabel: '承認待ち',
      stepName: 'テスト1',
      approveTime: '2004-04-01T12:00Z',
      approverName: '承認者名',
      actorPhotoUrl: imgPhoto,
      actorName: '申請者名',
      comment: 'コメント コメント コメント コメント コメント コメント コメント',
      isDelegated: false,
    },
  ],
  legalAgreementWorkSystem: LEGAL_AGREEMENT_WORK_SYSTEM.MODIFIED_YEARLY,
} as YearlyLegalAgreementRequest;

export const allEmpty = {
  request: {
    id: 'id',
    status: STATUS.PENDING,
    submitter: {
      employee: {
        name: 'EmployeeName',
        code: 'EMPLOYEE_CODE',
        photoUrl: imgPhoto,
        department: {
          name: 'DepartmentName',
        },
      },
      delegator: {
        employee: {
          name: 'DelegatorEmployeeName',
        },
      },
    },
    type: CODE.YEARLY,
    typeLabel: '年間',
    yearlyOvertimeHours: null,
    yearlyOvertimeHours1YearAgo: null,
    specialYearlyOvertimeHours: null,
    specialYearlyOvertimeHours1YearAgo: null,
    overtimeHoursLimit: null,
    changedOvertimeHoursLimit: null,
    requestableOvertimeHoursLimit: null,
    reason: null,
    measure: null,
  },
  originalRequest: null,
  historyList: [],
  legalAgreementWorkSystem: LEGAL_AGREEMENT_WORK_SYSTEM.MODIFIED_YEARLY,
} as YearlyLegalAgreementRequest;

export const allZero = {
  request: {
    id: 'id',
    status: STATUS.PENDING,
    submitter: {
      employee: {
        name: 'EmployeeName',
        code: 'EMPLOYEE_CODE',
        photoUrl: imgPhoto,
        department: {
          name: 'DepartmentName',
        },
      },
      delegator: {
        employee: {
          name: 'DelegatorEmployeeName',
        },
      },
    },
    type: CODE.YEARLY,
    typeLabel: '年間',
    yearlyOvertimeHours: 0,
    yearlyOvertimeHours1YearAgo: 0,
    specialYearlyOvertimeHours: 0,
    specialYearlyOvertimeHours1YearAgo: 0,
    overtimeHoursLimit: 0,
    changedOvertimeHoursLimit: 0,
    requestableOvertimeHoursLimit: 0,
    reason: '',
    measure: '',
  },
  originalRequest: null,
  historyList: [],
  legalAgreementWorkSystem: LEGAL_AGREEMENT_WORK_SYSTEM.MODIFIED_YEARLY,
} as YearlyLegalAgreementRequest;

export const defaultValueWithManager = {
  request: {
    id: 'id',
    status: STATUS.PENDING,
    submitter: {
      employee: {
        name: 'EmployeeName',
        code: 'EMPLOYEE_CODE',
        photoUrl: imgPhoto,
        department: {
          name: 'DepartmentName',
        },
      },
      delegator: {
        employee: {
          name: 'DelegatorEmployeeName',
        },
      },
    },
    type: CODE.YEARLY,
    typeLabel: '年間',
    yearlyOvertimeHours: 1,
    yearlyOvertimeHours1YearAgo: 2,
    specialYearlyOvertimeHours: 3,
    specialYearlyOvertimeHours1YearAgo: 4,
    overtimeHoursLimit: 5,
    changedOvertimeHoursLimit: 6,
    requestableOvertimeHoursLimit: 7,
    reason: '理由',
    measure: '対策',
  },
  originalRequest: null,
  historyList: [
    {
      id: 'id1',
      status: STATUS.PENDING,
      statusLabel: '承認待ち',
      stepName: 'テスト1',
      approveTime: '2004-04-01T12:00Z',
      approverName: '承認者名',
      actorPhotoUrl: imgPhoto,
      actorName: '申請者名',
      comment: 'コメント コメント コメント コメント コメント コメント コメント',
      isDelegated: false,
    },
  ],
  legalAgreementWorkSystem: LEGAL_AGREEMENT_WORK_SYSTEM.MANAGER,
} as YearlyLegalAgreementRequest;
