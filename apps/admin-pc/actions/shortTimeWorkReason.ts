import * as base from './base';

const FUNC_NAME = 'tag';
export const SEARCH_SHORT_TIME_WORK_REASON = 'SEARCH_SHORT_TIME_WORK_REASON';
export const CREATE_SHORT_TIME_WORK_REASON = 'CREATE_SHORT_TIME_WORK_REASON';
export const UPDATE_SHORT_TIME_WORK_REASON = 'UPDATE_SHORT_TIME_WORK_REASON';
export const DELETE_SHORT_TIME_WORK_REASON = 'DELETE_SHORT_TIME_WORK_REASON';
export const SEARCH_SHORT_TIME_WORK_REASON_ERROR =
  'SEARCH_SHORT_TIME_WORK_REASON_ERROR';
export const CREATE_SHORT_TIME_WORK_REASON_ERROR =
  'CREATE_SHORT_TIME_WORK_REASON_ERROR';
export const UPDATE_SHORT_TIME_WORK_REASON_ERROR =
  'UPDATE_SHORT_TIME_WORK_REASON_ERROR';
export const DELETE_SHORT_TIME_WORK_REASON_ERROR =
  'DELETE_SHORT_TIME_WORK_REASON_ERROR';

export const searchShortTimeWorkReason = (param = {}) => {
  return base.search(
    FUNC_NAME,
    {
      ...param,
      tagType: 'ShortenWorkReason',
    },
    SEARCH_SHORT_TIME_WORK_REASON,
    SEARCH_SHORT_TIME_WORK_REASON_ERROR
  );
};

export const createShortTimeWorkReason = (param) => {
  return base.create(
    FUNC_NAME,
    {
      ...param,
      tagType: 'ShortenWorkReason',
    },
    CREATE_SHORT_TIME_WORK_REASON,
    CREATE_SHORT_TIME_WORK_REASON_ERROR
  );
};

export const updateShortTimeWorkReason = (param) => {
  return base.update(
    FUNC_NAME,
    {
      ...param,
      tagType: 'ShortenWorkReason',
    },
    UPDATE_SHORT_TIME_WORK_REASON,
    UPDATE_SHORT_TIME_WORK_REASON_ERROR
  );
};

export const deleteShortTimeWorkReason = (param) => {
  return base.del(
    FUNC_NAME,
    {
      ...param,
      tagType: 'ShortenWorkReason',
    },
    DELETE_SHORT_TIME_WORK_REASON,
    DELETE_SHORT_TIME_WORK_REASON_ERROR
  );
};
