const response = {
  period: '2017-12',
  employeeInfoList: [
    {
      startDate: '2017-12-01',
      endDate: '2017-12-15',
      departmentName: '部署01',
      workingTypeName: '固定労働時間制1',
    },
    {
      startDate: '2017-12-16',
      endDate: '2017-12-31',
      departmentName: '部署02',
      workingTypeName: '固定労働時間制2',
    },
  ],
  employeeCode: '000001',
  employeeName: '田中 太郎',
  leaveDetails: [
    {
      requestId: 'a007F000007b5iqQAA',
      startDate: '2017-12-01',
      endDate: '2017-12-01',
      name: 'テスト年次有給休暇',
      range: 'Day',
      days: 1,
      leaveTime: null,
      remarks: null,
    },
    {
      requestId: 'a007F000007cvVgQAI',
      startDate: '2017-12-04',
      endDate: '2017-12-05',
      name: 'テスト年次有給休暇',
      range: 'Day',
      days: 2,
      leaveTime: null,
      remarks: '休暇をいただきます。',
    },
  ],
  annualLeaveGrants: [
    {
      validDateFrom: '2017-01-01',
      validDateTo: '2019-01-01',
      daysGranted: 10,
      daysTaken: 8,
      daysLeft: 2,
      comment: '定期付与',
    },
    {
      validDateFrom: '2018-01-01',
      validDateTo: '2020-01-01',
      daysGranted: 11,
      daysTaken: 1,
      hoursTaken: 2,
      daysLeft: 9.5,
      hoursLeft: 2,
      comment: '定期付与',
    },
  ],
  managedLeave: [
    {
      leaveName: '慶弔休暇',
      leaveType: 'Paid',
      grants: [
        {
          validDateFrom: '2017-01-01',
          validDateTo: '2019-01-01',
          daysGranted: 3,
          daysTaken: 3,
          daysLeft: 0,
          comment: '御祖父様逝去',
        },
        {
          validDateFrom: '2018-01-01',
          validDateTo: '2020-01-01',
          daysGranted: 7,
          daysTaken: 7,
          hoursTaken: 0,
          daysLeft: 0,
          hoursLeft: 0,
          comment: '本人の結婚',
        },
      ],
    },
    {
      leaveName: '無給の日数管理休暇',
      leaveType: 'Unpaid',
      grants: [
        {
          validDateFrom: '2017-01-01',
          validDateTo: '2019-01-01',
          daysGranted: 3,
          daysTaken: 3,
          daysLeft: 0,
          comment: '',
        },
        {
          validDateFrom: '2018-01-01',
          validDateTo: '2020-01-01',
          daysGranted: 7,
          daysTaken: 7,
          hoursTaken: 0,
          daysLeft: 0,
          hoursLeft: 0,
          comment: '',
        },
      ],
    },
  ],
};

export default response;
