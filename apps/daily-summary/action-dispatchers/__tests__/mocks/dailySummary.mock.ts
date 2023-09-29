const dailySummary = {
  targetDate: '2020-02-05',
  useWorkReportByJob: true,
  status: 'NotRequested',
  realWorkTime: null,
  output: null,
  note: null,
  isTemporaryWorkTime: null,
  taskList: [
    {
      workCategoryName: 'event',
      workCategoryList: [
        {
          name: 'event',
          id: 'a1G2v000003z0jkEAA',
          code: '7',
        },
      ],
      workCategoryId: 'a1G2v000003z0jkEAA',
      workCategoryCode: '7',
      volume: null,
      taskTime: 120,
      taskNote: null,
      ratio: null,
      jobName: 'JOB_NAME',
      jobId: 'a0h2v00000a4y34AAA',
      jobCode: '3',
      isDirectInput: true,
      isDirectCharged: true,
      hasJobType: true,
      eventList: [],
      isEditLocked: true,
    },
  ],
};

export const invalidRatioTotalTasks = [
  {
    workCategoryName: 'event',
    workCategoryList: [
      {
        name: 'event',
        id: 'a1G2v000003z0jkEAA',
        code: '7',
      },
    ],
    workCategoryId: 'a1G2v000003z0jkEAA',
    workCategoryCode: '7',
    volume: null,
    taskTime: 120,
    taskNote: null,
    ratio: 30,
    jobName: 'JOB_NAME',
    jobId: 'a0h2v00000a4y34AAA',
    jobCode: '3',
    isDirectInput: false,
    isDirectCharged: true,
    hasJobType: true,
    eventList: [],
    isEditLocked: true,
  },
  {
    workCategoryName: 'event',
    workCategoryList: [
      {
        name: 'event',
        id: 'a1G2v000003z0jkEAA',
        code: '7',
      },
    ],
    workCategoryId: 'a1G2v000003z0jkEAA',
    workCategoryCode: '7',
    volume: null,
    taskTime: 120,
    taskNote: null,
    ratio: 40,
    jobName: 'JOB_NAME',
    jobId: 'a0h2v00000a4y34AAA',
    jobCode: '3',
    isDirectInput: false,
    isDirectCharged: true,
    hasJobType: true,
    eventList: [],
    isEditLocked: true,
  },
];

export default dailySummary;
