import {
  EXCEED_ACT_WORK_HOURS_TYPE,
  FIELD_TYPE,
  OPERATOR_TYPE,
  OVER_LAPPING_TYPE,
  REFERENCE_SCOPE_TYPE,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';

import ValidError from '@apps/time-tracking/AutoHoursAllocateDictDialog/validators/ValidationError';

export const jobPickList = {
  byId: {
    1: {
      jobId: '1',
      jobCode: 'job1',
      jobName: 'job1',
      hasJobType: true,
    },
  },
  allIds: ['1'],
};

export const allocateDicList = {
  1: {
    key: '1',
    internalUniqKey: '1',
    fieldType: FIELD_TYPE.DESCRIPTION,
    operatorType: OPERATOR_TYPE.END_WITH,
    valueText: '1',
    job: {
      id: '1',
      code: '1',
      name: '1',
      hasJobType: true,
    },
    workCategory: {
      workCategoryId: '1',
      workCategoryCode: '1',
      workCategoryName: 'AAAAA',
    },
    referenceScopeType: REFERENCE_SCOPE_TYPE.DEPARTMENT,
    priority: 1,
  },
  2: {
    key: '2',
    internalUniqKey: '2',
    fieldType: FIELD_TYPE.DESCRIPTION,
    operatorType: OPERATOR_TYPE.END_WITH,
    valueText: '2',
    job: {
      id: '1',
      code: '1',
      name: '1',
      hasJobType: true,
    },
    workCategory: {
      workCategoryId: '2',
      workCategoryCode: '2',
      workCategoryName: 'BBBBB',
    },
    referenceScopeType: REFERENCE_SCOPE_TYPE.INDIVIDUAL,
    priority: 2,
  },
};

export const allocateDicListFromResult = {
  1: {
    key: '1',
    internalUniqKey: '1',
    fieldType: FIELD_TYPE.DESCRIPTION,
    operatorType: OPERATOR_TYPE.END_WITH,
    valueText: '1',
    job: {
      id: '1',
      code: '1',
      name: '1',
      hasJobType: true,
    },
    workCategory: {
      workCategoryId: '1',
      workCategoryCode: '1',
      workCategoryName: 'AAAAA',
    },
    referenceScopeType: REFERENCE_SCOPE_TYPE.DEPARTMENT,
    priority: 1,
  },
  2: {
    key: '2',
    internalUniqKey: '2',
    fieldType: FIELD_TYPE.DESCRIPTION,
    operatorType: OPERATOR_TYPE.END_WITH,
    valueText: '2',
    job: {
      id: '1',
      code: '1',
      name: '1',
      hasJobType: true,
    },
    workCategory: {
      workCategoryId: '2',
      workCategoryCode: '2',
      workCategoryName: 'BBBBB',
    },
    referenceScopeType: REFERENCE_SCOPE_TYPE.INDIVIDUAL,
    priority: 2,
    isFromResult: true,
  },
};

export const allocateDicListHasError = {
  1: {
    key: '1',
    internalUniqKey: '1',
    fieldType: FIELD_TYPE.DESCRIPTION,
    operatorType: OPERATOR_TYPE.END_WITH,
    valueText: '1',
    job: {
      id: '1',
      code: '1',
      name: '1',
      hasJobType: true,
    },
    workCategory: {
      workCategoryId: '1',
      workCategoryCode: '1',
      workCategoryName: 'AAAAA',
    },
    referenceScopeType: REFERENCE_SCOPE_TYPE.DEPARTMENT,
    priority: 1,
  },
  2: {
    key: '2',
    internalUniqKey: '2',
    fieldType: FIELD_TYPE.DESCRIPTION,
    operatorType: OPERATOR_TYPE.END_WITH,
    valueText: '2',
    job: {
      id: '1',
      code: '1',
      name: '1',
      hasJobType: true,
    },
    workCategory: {
      workCategoryId: '2',
      workCategoryCode: '2',
      workCategoryName: 'BBBBB',
    },
    referenceScopeType: REFERENCE_SCOPE_TYPE.INDIVIDUAL,
    priority: 2,
  },
};

export const basicSettingData = {
  surplusTimeRegistrationJob: {
    id: '1',
    code: '1',
    name: '1',
    hasJobType: true,
  },
  surplusTimeRegistrationWorkCategory: {
    workCategoryId: '1',
    workCategoryCode: '1',
    workCategoryName: 'AAAAA',
  },
  allocateMethodForOverlappingEvent: OVER_LAPPING_TYPE.NONE,
  allocateMethodForExceedActWorkHour: EXCEED_ACT_WORK_HOURS_TYPE.REDUCE_EVENLY,
};

export const validationErrors = [
  new ValidError('該当テキストが設定されていません', 'ValueTextIsNull', {
    label: '優先順位 1',
    field: 'valueText',
    record: '1',
  }),
];
