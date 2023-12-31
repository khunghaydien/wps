import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

import { State } from '../../patternRequest';

export const patternRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'Pattern',
    requestTypeName: '勤務時間変更',
    status: 'NotRequested',
    startDate: '2020-04-07',
    endDate: '2020-04-07',
    startTime: 540,
    endTime: 1080,
    remarks: '',
    reason: '',
    leaveName: '',
    leaveCode: '',
    leaveType: null,
    leaveRange: null,
    leaveDetailCode: null,
    leaveDetailName: null,
    substituteLeaveType: null,
    substituteDate: '',
    originalRequestId: '',
    isForReapply: false,
    directApplyRestTimes: [],
    patternCode: 'test01',
    patternName: '変形労働時間制01',
    workSystem: 'JP:Modified',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
    patternRestTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    requireReason: false,
    approver01Name: '',
    type: 'Pattern',
    personalReason: false,
    useManagePersonalReason: false,
    requestDayType: null,
    requestableDayType: 'Holiday',
    canDirectInputTimeRequest: false,
    isDirectInputTimeRequest: false,
    useLateArrivalReason: false,
    useEarlyLeaveReason: false,
    reasonId: '',
    reasonCode: '',
    reasonName: '',
  },
  attPatternList: [
    {
      name: '変形労働時間制01',
      code: 'test01',
      startTime: 540,
      endTime: 1080,
      restTimes: [
        {
          startTime: 720,
          endTime: 780,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 900,
          endTime: 960,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 1020,
          endTime: 1080,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
      ],
      workSystem: 'JP:Modified',
      flexStartTime: null,
      flexEndTime: null,
      withoutCoreTime: false,
    },
  ],
  workingTypeInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  directInputInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  selectedAttPattern: {
    name: '変形労働時間制01',
    code: 'test01',
    startTime: 540,
    endTime: 1080,
    restTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    workSystem: 'JP:Modified',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
  },
  hasRange: false,
};

export const patternFixRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'Pattern',
    requestTypeName: '勤務時間変更',
    status: 'NotRequested',
    startDate: '2021-11-09',
    endDate: '2021-11-09',
    startTime: 540,
    endTime: 1080,
    remarks: '',
    reason: '',
    leaveName: '',
    leaveCode: '',
    leaveType: null,
    leaveRange: null,
    leaveDetailCode: null,
    leaveDetailName: null,
    substituteLeaveType: null,
    substituteDate: '',
    originalRequestId: '',
    isForReapply: false,
    directApplyRestTimes: [],
    patternCode: 'test01',
    patternName: '固定労働時間制01',
    workSystem: 'JP:Fix',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
    patternRestTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    requireReason: false,
    approver01Name: '',
    type: 'Pattern',
    personalReason: false,
    useManagePersonalReason: false,
    requestDayType: null,
    requestableDayType: 'Holiday',
    canDirectInputTimeRequest: false,
    isDirectInputTimeRequest: false,
    useLateArrivalReason: false,
    useEarlyLeaveReason: false,
    reasonId: '',
    reasonCode: '',
    reasonName: '',
  },
  attPatternList: [
    {
      name: '固定労働時間制01',
      code: 'test01',
      startTime: 540,
      endTime: 1080,
      restTimes: [
        {
          startTime: 720,
          endTime: 780,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 900,
          endTime: 960,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 1020,
          endTime: 1080,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
      ],
      workSystem: 'JP:Fix',
      flexStartTime: null,
      flexEndTime: null,
      withoutCoreTime: false,
    },
  ],
  workingTypeInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  directInputInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  selectedAttPattern: {
    name: '固定労働時間制01',
    code: 'test01',
    startTime: 540,
    endTime: 1080,
    restTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    workSystem: 'JP:Fix',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
  },
  hasRange: false,
};

export const patternFlexRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'Pattern',
    requestTypeName: '勤務時間変更',
    status: 'NotRequested',
    startDate: '2021-11-10',
    endDate: '2021-11-10',
    startTime: 540,
    endTime: 960,
    remarks: '',
    reason: '',
    leaveName: '',
    leaveCode: '',
    leaveType: null,
    leaveRange: null,
    leaveDetailCode: null,
    leaveDetailName: null,
    substituteLeaveType: null,
    substituteDate: '',
    originalRequestId: '',
    isForReapply: false,
    directApplyRestTimes: [],
    patternCode: 'test01',
    patternName: 'フレックスタイム制01',
    workSystem: 'JP:Flex',
    flexStartTime: 480,
    flexEndTime: 1080,
    withoutCoreTime: false,
    patternRestTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    requireReason: false,
    approver01Name: '',
    type: 'Pattern',
    personalReason: false,
    useManagePersonalReason: false,
    requestDayType: null,
    requestableDayType: 'Holiday',
    canDirectInputTimeRequest: false,
    isDirectInputTimeRequest: false,
    useLateArrivalReason: false,
    useEarlyLeaveReason: false,
    reasonId: '',
    reasonCode: '',
    reasonName: '',
  },
  workingTypeInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  directInputInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  attPatternList: [
    {
      name: 'フレックスタイム制01',
      code: 'test01',
      startTime: 540,
      endTime: 960,
      restTimes: [
        {
          startTime: 720,
          endTime: 780,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 900,
          endTime: 960,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 1020,
          endTime: 1080,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
      ],
      workSystem: 'JP:Flex',
      flexStartTime: 480,
      flexEndTime: 1080,
      withoutCoreTime: false,
    },
  ],
  selectedAttPattern: {
    name: 'フレックスタイム制01',
    code: 'test01',
    startTime: 540,
    endTime: 960,
    restTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    workSystem: 'JP:Flex',
    flexStartTime: 480,
    flexEndTime: 1080,
    withoutCoreTime: false,
  },
  hasRange: false,
};

export const patternFlexWithoutCoretimeRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'Pattern',
    requestTypeName: '勤務時間変更',
    status: 'NotRequested',
    startDate: '2021-11-10',
    endDate: '2021-11-10',
    startTime: null,
    endTime: null,
    remarks: '',
    reason: '',
    leaveName: '',
    leaveCode: '',
    leaveType: null,
    leaveRange: null,
    leaveDetailCode: null,
    leaveDetailName: null,
    substituteLeaveType: null,
    substituteDate: '',
    originalRequestId: '',
    isForReapply: false,
    directApplyRestTimes: [],
    patternCode: 'test01',
    patternName: 'フレックスタイム制01',
    workSystem: 'JP:Flex',
    flexStartTime: 480,
    flexEndTime: 1080,
    withoutCoreTime: true,
    patternRestTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    requireReason: false,
    approver01Name: '',
    type: 'Pattern',
    personalReason: false,
    useManagePersonalReason: false,
    requestDayType: null,
    requestableDayType: 'Holiday',
    canDirectInputTimeRequest: false,
    isDirectInputTimeRequest: false,
    useLateArrivalReason: false,
    useEarlyLeaveReason: false,
    reasonId: '',
    reasonCode: '',
    reasonName: '',
  },
  attPatternList: [
    {
      name: 'フレックスタイム制01',
      code: 'test01',
      startTime: null,
      endTime: null,
      restTimes: [
        {
          startTime: 720,
          endTime: 780,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 900,
          endTime: 960,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 1020,
          endTime: 1080,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
      ],
      workSystem: 'JP:Flex',
      flexStartTime: 480,
      flexEndTime: 1080,
      withoutCoreTime: true,
    },
  ],
  workingTypeInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  directInputInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  selectedAttPattern: {
    name: 'フレックスタイム制01',
    code: 'test01',
    startTime: null,
    endTime: null,
    restTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    workSystem: 'JP:Flex',
    flexStartTime: 480,
    flexEndTime: 1080,
    withoutCoreTime: true,
  },
  hasRange: false,
};

export const patternDiscretionRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'Pattern',
    requestTypeName: '勤務時間変更',
    status: 'NotRequested',
    startDate: '2021-11-10',
    endDate: '2021-11-10',
    startTime: 540,
    endTime: 1080,
    remarks: '',
    reason: '',
    leaveName: '',
    leaveCode: '',
    leaveType: null,
    leaveRange: null,
    leaveDetailCode: null,
    leaveDetailName: null,
    substituteLeaveType: null,
    substituteDate: '',
    originalRequestId: '',
    isForReapply: false,
    directApplyRestTimes: [],
    patternCode: 'test01',
    patternName: '裁量労働制01',
    workSystem: 'JP:Discretion',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
    patternRestTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    requireReason: false,
    approver01Name: '',
    type: 'Pattern',
    personalReason: false,
    useManagePersonalReason: false,
    requestDayType: null,
    requestableDayType: 'Holiday',
    canDirectInputTimeRequest: false,
    isDirectInputTimeRequest: false,
    useLateArrivalReason: false,
    useEarlyLeaveReason: false,
    reasonId: '',
    reasonCode: '',
    reasonName: '',
  },
  attPatternList: [
    {
      name: '裁量労働制01',
      code: 'test01',
      startTime: 600,
      endTime: 1020,
      restTimes: [
        {
          startTime: 720,
          endTime: 780,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 840,
          endTime: 900,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 960,
          endTime: 1020,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
      ],
      workSystem: 'JP:Discretion',
      flexStartTime: null,
      flexEndTime: null,
      withoutCoreTime: false,
    },
  ],
  workingTypeInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  directInputInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  selectedAttPattern: {
    name: '裁量労働制01',
    code: 'test01',
    startTime: 600,
    endTime: 1020,
    restTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 840,
        endTime: 900,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 960,
        endTime: 1020,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    workSystem: 'JP:Discretion',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: true,
  },
  hasRange: false,
};

export const patternDiscretionWithoutTimeRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'Pattern',
    requestTypeName: '勤務時間変更',
    status: 'NotRequested',
    startDate: '2021-11-10',
    endDate: '2021-11-10',
    startTime: null,
    endTime: null,
    remarks: '',
    reason: '',
    leaveName: '',
    leaveCode: '',
    leaveType: null,
    leaveRange: null,
    leaveDetailCode: null,
    leaveDetailName: null,
    substituteLeaveType: null,
    substituteDate: '',
    originalRequestId: '',
    isForReapply: false,
    directApplyRestTimes: [],
    patternCode: 'test01',
    patternName: '裁量労働制01',
    workSystem: 'JP:Discretion',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
    patternRestTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    requireReason: false,
    approver01Name: '',
    type: 'Pattern',
    personalReason: false,
    useManagePersonalReason: false,
    requestDayType: null,
    requestableDayType: 'Holiday',
    canDirectInputTimeRequest: false,
    isDirectInputTimeRequest: false,
    useLateArrivalReason: false,
    useEarlyLeaveReason: false,
    reasonId: '',
    reasonCode: '',
    reasonName: '',
  },
  attPatternList: [
    {
      name: '裁量労働制01',
      code: 'test01',
      startTime: null,
      endTime: null,
      restTimes: [
        {
          startTime: 720,
          endTime: 780,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 840,
          endTime: 900,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 960,
          endTime: 1020,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
      ],
      workSystem: 'JP:Discretion',
      flexStartTime: null,
      flexEndTime: null,
      withoutCoreTime: false,
    },
  ],
  workingTypeInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  directInputInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  selectedAttPattern: {
    name: '裁量労働制01',
    code: 'test01',
    startTime: null,
    endTime: null,
    restTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 840,
        endTime: 900,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 960,
        endTime: 1020,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    workSystem: 'JP:Discretion',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: true,
  },
  hasRange: false,
};

export const patternManagerRequest: State = {
  request: {
    id: '',
    requestTypeCode: 'Pattern',
    requestTypeName: '勤務時間変更',
    status: 'NotRequested',
    startDate: '2021-11-10',
    endDate: '2021-11-10',
    startTime: 540,
    endTime: 1080,
    remarks: '',
    reason: '',
    leaveName: '',
    leaveCode: '',
    leaveType: null,
    leaveRange: null,
    leaveDetailCode: null,
    leaveDetailName: null,
    substituteLeaveType: null,
    substituteDate: '',
    originalRequestId: '',
    isForReapply: false,
    directApplyRestTimes: [],
    patternCode: 'test01',
    patternName: '管理監督者01',
    workSystem: 'JP:Manager',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: false,
    patternRestTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 900,
        endTime: 960,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1020,
        endTime: 1080,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    requireReason: false,
    approver01Name: '',
    type: 'Pattern',
    personalReason: false,
    useManagePersonalReason: false,
    requestDayType: null,
    requestableDayType: 'Holiday',
    canDirectInputTimeRequest: false,
    isDirectInputTimeRequest: false,
    useLateArrivalReason: false,
    useEarlyLeaveReason: false,
    reasonId: '',
    reasonCode: '',
    reasonName: '',
  },
  attPatternList: [
    {
      name: '管理監督者01',
      code: 'test01',
      startTime: 600,
      endTime: 1020,
      restTimes: [
        {
          startTime: 720,
          endTime: 780,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 840,
          endTime: 900,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
        {
          startTime: 960,
          endTime: 1020,
          restReason: {
            id: 'a0A2800000FmMQCEA1',
            name: 'お昼休み',
            code: '001',
          },
        },
      ],
      workSystem: 'JP:Manager',
      flexStartTime: null,
      flexEndTime: null,
      withoutCoreTime: false,
    },
  ],
  workingTypeInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },
  directInputInfo: {
    name: null,
    code: null,
    startTime: 0,
    endTime: 0,
    restTimes: [],
    workSystem: WORK_SYSTEM_TYPE.JP_Fix,
    flexStartTime: 0,
    flexEndTime: 0,
    withoutCoreTime: false,
  },

  selectedAttPattern: {
    name: '管理監督者01',
    code: 'test01',
    startTime: 600,
    endTime: 1020,
    restTimes: [
      {
        startTime: 720,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 840,
        endTime: 900,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 960,
        endTime: 1020,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ],
    workSystem: 'JP:Manager',
    flexStartTime: null,
    flexEndTime: null,
    withoutCoreTime: true,
  },
  hasRange: false,
};
