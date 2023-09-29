import { State } from '../../patternRequest';

const patternRequest: State = {
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
    substituteLeaveType: null,
    substituteDate: '',
    originalRequestId: '',
    isForReapply: false,
    directApplyRestTimes: [],
    patternCode: 'test01',
    patternName: '変形労働時間制01',
    patternRestTimes: [
      {
        startTime: 720,
        endTime: 780,
      },
      {
        startTime: 900,
        endTime: 960,
      },
      {
        startTime: 1020,
        endTime: 1080,
      },
    ],
    requireReason: false,
    approver01Name: '',
    type: 'Pattern',
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
        },
        {
          startTime: 900,
          endTime: 960,
        },
        {
          startTime: 1020,
          endTime: 1080,
        },
      ],
    },
  ],
  selectedAttPattern: {
    name: '変形労働時間制01',
    code: 'test01',
    startTime: 540,
    endTime: 1080,
    restTimes: [
      {
        startTime: 720,
        endTime: 780,
      },
      {
        startTime: 900,
        endTime: 960,
      },
      {
        startTime: 1020,
        endTime: 1080,
      },
    ],
  },
  hasRange: false,
};

export default patternRequest;
