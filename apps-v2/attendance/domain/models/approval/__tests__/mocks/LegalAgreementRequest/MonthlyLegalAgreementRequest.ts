import imgPhoto from '@commons/images/Sample_photo001.png';

import {
  MonthlyLegalAgreementRequest,
  STATUS,
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
    type: CODE.MONTHLY,
    typeLabel: '月間',
    monthlyOvertimeHours: 1,
    monthlyOvertimeHours1MoAgo: 2,
    monthlyOvertimeHours2MoAgo: 3,
    specialMonthlyOvertimeHours: 4,
    specialMonthlyOvertimeHours1MoAgo: 5,
    specialMonthlyOvertimeHours2MoAgo: 6,
    overtimeHoursLimit: 7,
    extensionCount: 8,
    extensionCountLimit: 9,
    changedOvertimeHoursLimit: 10,
    requestableOvertimeHoursLimit: 11,
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
} as MonthlyLegalAgreementRequest;

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
    type: CODE.MONTHLY,
    typeLabel: '月間',
    monthlyOvertimeHours: null,
    monthlyOvertimeHours1MoAgo: null,
    monthlyOvertimeHours2MoAgo: null,
    specialMonthlyOvertimeHours: null,
    specialMonthlyOvertimeHours1MoAgo: null,
    specialMonthlyOvertimeHours2MoAgo: null,
    overtimeHoursLimit: null,
    extensionCount: null,
    extensionCountLimit: null,
    changedOvertimeHoursLimit: null,
    requestableOvertimeHoursLimit: null,
    reason: null,
    measure: null,
  },
  originalRequest: null,
  historyList: [],
  legalAgreementWorkSystem: LEGAL_AGREEMENT_WORK_SYSTEM.MODIFIED_YEARLY,
} as MonthlyLegalAgreementRequest;

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
    type: CODE.MONTHLY,
    typeLabel: '月間',
    monthlyOvertimeHours: 0,
    monthlyOvertimeHours1MoAgo: 0,
    monthlyOvertimeHours2MoAgo: 0,
    specialMonthlyOvertimeHours: 0,
    specialMonthlyOvertimeHours1MoAgo: 0,
    specialMonthlyOvertimeHours2MoAgo: 0,
    overtimeHoursLimit: 0,
    extensionCount: 0,
    extensionCountLimit: 0,
    changedOvertimeHoursLimit: 0,
    requestableOvertimeHoursLimit: 0,
    reason: '',
    measure: '',
  },
  originalRequest: null,
  historyList: [],
  legalAgreementWorkSystem: LEGAL_AGREEMENT_WORK_SYSTEM.MODIFIED_YEARLY,
} as MonthlyLegalAgreementRequest;

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
    type: CODE.MONTHLY,
    typeLabel: '月間',
    monthlyOvertimeHours: 1,
    monthlyOvertimeHours1MoAgo: 2,
    monthlyOvertimeHours2MoAgo: 3,
    specialMonthlyOvertimeHours: 4,
    specialMonthlyOvertimeHours1MoAgo: 5,
    specialMonthlyOvertimeHours2MoAgo: 6,
    overtimeHoursLimit: 7,
    extensionCount: 8,
    extensionCountLimit: 9,
    changedOvertimeHoursLimit: 10,
    requestableOvertimeHoursLimit: 11,
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
} as MonthlyLegalAgreementRequest;

export const reapplyValue = {
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
    type: CODE.MONTHLY,
    typeLabel: '月間',
    monthlyOvertimeHours: 1,
    monthlyOvertimeHours1MoAgo: 2,
    monthlyOvertimeHours2MoAgo: 3,
    specialMonthlyOvertimeHours: 4,
    specialMonthlyOvertimeHours1MoAgo: 5,
    specialMonthlyOvertimeHours2MoAgo: 6,
    overtimeHoursLimit: 7,
    extensionCount: 8,
    extensionCountLimit: 9,
    changedOvertimeHoursLimit: 120,
    requestableOvertimeHoursLimit: 11,
    reason: '理由',
    measure: '対策',
  },
  originalRequest: {
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
    type: CODE.MONTHLY,
    typeLabel: '月間',
    monthlyOvertimeHours: 1,
    monthlyOvertimeHours1MoAgo: 2,
    monthlyOvertimeHours2MoAgo: 3,
    specialMonthlyOvertimeHours: 4,
    specialMonthlyOvertimeHours1MoAgo: 5,
    specialMonthlyOvertimeHours2MoAgo: 6,
    overtimeHoursLimit: 7,
    extensionCount: 8,
    extensionCountLimit: 9,
    changedOvertimeHoursLimit: 240,
    requestableOvertimeHoursLimit: 11,
    reason: '理由1',
    measure: '対策2',
  },
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
} as MonthlyLegalAgreementRequest;
