export const INITIALIZE = 'INITIALIZE';
export const SET_EDIT_RECORD = 'SET_EDIT_RECORD';
export const SET_TMP_EDIT_RECORD = 'SET_TMP_EDIT_RECORD';
export const SET_TMP_EDIT_RECORD_BY_KEY_VALUE =
  'SET_TMP_EDIT_RECORD_BY_KEY_VALUE';
export const SET_EDIT_RECORD_HISTORY = 'SET_EDIT_RECORD_HISTORY';
export const SET_TMP_EDIT_RECORD_HISTORY = 'SET_TMP_EDIT_RECORD_HISTORY';
export const SET_TMP_EDIT_RECORD_HISTORY_BY_KEY_VALUE =
  'SET_TMP_EDIT_RECORD_HISTORY_BY_KEY_VALUE';

export function initializeEditRecord() {
  return {
    type: INITIALIZE,
  };
}

export function setEditRecord(editRecord) {
  return {
    type: SET_EDIT_RECORD,
    payload: editRecord,
  };
}

export function setTmpEditRecord(tmpEditRecord) {
  return {
    type: SET_TMP_EDIT_RECORD,
    payload: tmpEditRecord,
  };
}

export function setTmpEditRecordByKeyValue(key, value) {
  return {
    type: SET_TMP_EDIT_RECORD_BY_KEY_VALUE,
    payload: { key, value },
  };
}

export function setEditRecordHistory(editRecordHistory) {
  return {
    type: SET_EDIT_RECORD_HISTORY,
    payload: editRecordHistory,
  };
}

export function setTmpEditRecordHistory(tmpEditRecordHistory) {
  return {
    type: SET_TMP_EDIT_RECORD_HISTORY,
    payload: tmpEditRecordHistory,
  };
}
export function setTmpEditRecordHistoryByKeyValue(key, value) {
  return {
    type: SET_TMP_EDIT_RECORD_HISTORY_BY_KEY_VALUE,
    payload: { key, value },
  };
}
