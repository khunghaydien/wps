const response = {
  period: '2021-11',
  employeeCode: '000002',
  employeeName: '管理者 一郎',
  employeeInfoList: [
    {
      startDate: '2021-11-01',
      endDate: '2021-11-15',
      departmentName: '部署01',
      workingTypeName: '固定労働時間制1',
    },
    {
      startDate: '2021-11-16',
      endDate: '2021-11-30',
      departmentName: '部署02',
      workingTypeName: '固定労働時間制2',
    },
  ],
  dailyRecordList: [
    {
      recordDate: '2021-11-01',
      dailyAllowanceList: [
        {
          allowanceName: '高所作業',
          allowanceCode: '001',
          managementType: 'StartEndTime',
          order: 1,
          startTime: 540,
          endTime: 600,
          totalTime: 60,
          quantity: null,
        },
        {
          allowanceName: '高温作業',
          allowanceCode: '002',
          managementType: 'Hours',
          order: 2,
          startTime: null,
          endTime: null,
          totalTime: 60,
          quantity: null,
        },
      ],
    },
    {
      recordDate: '2021-11-02',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-03',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-04',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-05',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-06',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-07',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-08',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-09',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-10',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-11',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-12',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-13',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-14',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-15',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-16',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-17',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-18',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-19',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-20',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-21',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-22',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-23',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-24',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-25',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-26',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-27',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-28',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-29',
      dailyAllowanceList: [],
    },
    {
      recordDate: '2021-11-30',
      dailyAllowanceList: [
        {
          allowanceName: '高温作業',
          allowanceCode: '003',
          managementType: 'Quantity',
          order: 3,
          startTime: null,
          endTime: null,
          totalTime: null,
          quantity: 30,
        },
      ],
    },
  ],
};

export default response;
