import { TASK_INPUT_MODE } from '../../../../constants/TASK_INPUT_MODE';

const stateTaskList = [
  {
    id: '1',
    jobId: '001',
    jobCode: 'CODE001',
    jobName: 'JOB0001',
    hasJobType: false,
    isDirectCharged: false,
    workCategoryId: '001',
    workCategoryName: 'WC001',
    workCategoryCode: 'WC_CODE001',
    isDirectInput: true,
    ratio: null,
    taskTime: 300,
    workCategoryList: [],
  },
  {
    id: '2',
    jobId: '002',
    jobCode: 'CODE002',
    jobName: 'JOB0002',
    hasJobType: false,
    isDirectCharged: false,
    workCategoryId: '002',
    workCategoryName: 'WC002',
    workCategoryCode: 'WC_CODE002',
    isDirectInput: true,
    ratio: null,
    taskTime: 300,
    workCategoryList: [],
  },
  {
    id: '3',
    jobId: '003',
    jobCode: 'CODE003',
    jobName: 'JOB0003',
    hasJobType: false,
    isDirectCharged: false,
    workCategoryId: '003',
    workCategoryName: 'WC003',
    workCategoryCode: 'WC_CODE003',
    isDirectInput: true,
    ratio: null,
    taskTime: 300,
    workCategoryList: [],
  },
];

export const state = {
  targetDate: '2020-01-10',
  useTimeAutoWorkingHourAllocation: true,
  useWorkReportByJob: true,
  note: 'TEST',
  timestampComment: 'HOGE',
  isEnableEndStamp: false,
  taskInputMode: TASK_INPUT_MODE.WORK_DURATION,
  taskList: stateTaskList,
  originalTaskList: stateTaskList,
  realWorkTime: 0,
  isTemporaryWorkTime: false,
  isJobSelectDialogOpened: false,
};

export const job = {
  id: '2',
  code: 'CODE002',
  name: 'JOB002',
  parentId: null,
  hasJobType: true,
  hasChildren: true,
  isDirectCharged: true,
  isEditLocked: true,
};

export const workCategories = [
  {
    id: '1',
    code: 'CODE001',
    name: 'WC001',
  },
  {
    id: '2',
    code: 'CODE002',
    name: 'WC002',
  },
];

export const fromRemote = {
  targetDate: '2020-01-08',
  useWorkReportByJob: true,
  useTimeAutoWorkingHourAllocation: true,
  status: 'NotRequested',
  realWorkTime: 480,
  output: null,
  note: null,
  isTemporaryWorkTime: false,
  taskList: [
    {
      workCategoryName:
        '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。 何でも薄暗いじめじめした所でニャ',
      workCategoryList: [
        {
          name: 'ピザの上にペパロニを載せる',
          id: 'a1F2v00000CwPPzEAN',
          code: '1',
        },
        {
          name: '▲刺身の上にタンポポを乗せる',
          id: 'a1F2v00000CwPQ4EAN',
          code: '2',
        },
        {
          name: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れ',
          id: 'a1F2v00000CwPQEEA3',
          code: '3',
        },
        {
          name: '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。 何でも薄暗いじめじめした所でニャ',
          id: 'a1F2v00000CwPQJEA3',
          code: '4',
        },
        { name: '7', id: 'a1F2v00000CwZRHEA3', code: '7' },
      ],
      workCategoryId: 'a1F2v00000CwPQJEA3',
      workCategoryCode: '4',
      volume: 260,
      taskTime: 240,
      taskNote: null,
      ratio: 50,
      jobName: '7',
      jobId: 'a0h2v00000Xa3gRAAR',
      jobCode: '7',
      isDirectInput: false,
      isDirectCharged: true,
      hasJobType: true,
      eventList: [],
      isEditLocked: true,
    },
    {
      workCategoryName: null,
      workCategoryList: [
        {
          name: 'ピザの上にペパロニを載せる',
          id: 'a1F2v00000CwPPzEAN',
          code: '1',
        },
        {
          name: '▲刺身の上にタンポポを乗せる',
          id: 'a1F2v00000CwPQ4EAN',
          code: '2',
        },
        {
          name: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れ',
          id: 'a1F2v00000CwPQEEA3',
          code: '3',
        },
        {
          name: '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。 何でも薄暗いじめじめした所でニャ',
          id: 'a1F2v00000CwPQJEA3',
          code: '4',
        },
        { name: '7', id: 'a1F2v00000CwZRHEA3', code: '7' },
      ],
      workCategoryId: null,
      workCategoryCode: null,
      volume: 260,
      taskTime: 240,
      taskNote: null,
      ratio: 50,
      jobName: 'とっくりセーターを半分だけかぶるモデルの仕事',
      jobId: 'a0h2v00000XB8oWAAT',
      jobCode: '6',
      isDirectInput: false,
      isDirectCharged: false,
      hasJobType: true,
      eventList: [],
      isEditLocked: true,
    },
    {
      workCategoryName: null,
      workCategoryList: [],
      workCategoryId: null,
      workCategoryCode: null,
      volume: null,
      taskTime: 0,
      taskNote: null,
      ratio: null,
      jobName: 'TEST',
      jobId: 'a0h2v00000c8mVQAAY',
      jobCode: 'TEST',
      isDirectInput: true,
      isDirectCharged: true,
      hasJobType: false,
      eventList: [],
      isEditLocked: true,
    },
  ],
};
