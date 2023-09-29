import {
  TempFractionGrantRecord,
  update,
} from '@apps/attendance/domain/models/admin/FractionGrant';

type State = {
  isShowFractionDialog: boolean;
  isShowSuccessMessage: boolean;
  detailEvent: TempFractionGrantRecord;
  tempEvent: TempFractionGrantRecord;
  targetGrantHistoryRecordId: string;
};

const initialState: State = {
  isShowFractionDialog: false,
  isShowSuccessMessage: false,
  detailEvent: null,
  tempEvent: null,
  targetGrantHistoryRecordId: null,
};

export const ActionType = {
  SET_SHOW_DIALOG: 'MODULES/FRACTION_GRANT/UI/SET_SHOW_DIALOG',
  SET_SHOW_SUCCESS_MESSAGE:
    'MODULES/FRACTION_GRANT/UI/SET_SHOW_SUCCESS_MESSAGE',
  SET_DETAIL_EVENT: 'MODULES/FRACTION_GRANT/UI/SET_DETAIL_EVENT',
  UPDATE: 'MODULES/FRACTION_GRANT/UI/UPDATE',
  SET_TEMP_EVENT: 'MODULES/FRACTION_GRANT/UI/SET_TEMP_EVENT',
  SET_TARGET_GRANT_HISTORY_RECORD_ID:
    'MODULES/FRACTION_GRANT/UI/SET_TARGET_GRANT_HISTORY_RECORD_ID',
};

type SetShowDialog = {
  type: typeof ActionType.SET_SHOW_DIALOG;
  payload: boolean;
};

type SetShowSuccessMessage = {
  type: typeof ActionType.SET_SHOW_SUCCESS_MESSAGE;
  payload: boolean;
};

type SetDetailEvent = {
  type: typeof ActionType.SET_DETAIL_EVENT;
  payload: TempFractionGrantRecord;
};

type SetTargetGrantHistoryRecordId = {
  type: typeof ActionType.SET_TARGET_GRANT_HISTORY_RECORD_ID;
  payload: string;
};

type Keys = keyof TempFractionGrantRecord;

type Values = TempFractionGrantRecord[keyof TempFractionGrantRecord];

type Update = {
  type: typeof ActionType.UPDATE;
  payload: {
    key: Keys;
    value: Values;
  };
};

type SetTempEvent = {
  type: typeof ActionType.SET_TEMP_EVENT;
  payload: TempFractionGrantRecord;
};

type Action =
  | SetShowDialog
  | SetShowSuccessMessage
  | Update
  | SetDetailEvent
  | SetTempEvent
  | SetTargetGrantHistoryRecordId;

export const actions = {
  setShowDialog: (isShow: boolean): SetShowDialog => ({
    type: ActionType.SET_SHOW_DIALOG,
    payload: isShow,
  }),
  setShowSuccessMessage: (isShow: boolean): SetShowSuccessMessage => ({
    type: ActionType.SET_SHOW_SUCCESS_MESSAGE,
    payload: isShow,
  }),
  setDetailEvent: (detailEvent: TempFractionGrantRecord): SetDetailEvent => ({
    type: ActionType.SET_DETAIL_EVENT,
    payload: detailEvent,
  }),
  setTempEvent: (detailEvent: TempFractionGrantRecord): SetTempEvent => ({
    type: ActionType.SET_TEMP_EVENT,
    payload: detailEvent,
  }),
  setTargetGrantHistoryRecordId: (
    targetGrantHistoryRecordId: string
  ): SetTargetGrantHistoryRecordId => ({
    type: ActionType.SET_TARGET_GRANT_HISTORY_RECORD_ID,
    payload: targetGrantHistoryRecordId,
  }),
  update: (key: Keys, value: Values): Update => ({
    type: ActionType.UPDATE,
    payload: { key, value },
  }),
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_SHOW_DIALOG:
      return {
        ...state,
        isShowFractionDialog: (action as SetShowDialog).payload,
      };
    case ActionType.SET_SHOW_SUCCESS_MESSAGE:
      return {
        ...state,
        isShowSuccessMessage: (action as SetShowSuccessMessage).payload,
      };
    case ActionType.UPDATE:
      const { tempEvent } = state;
      const { key, value } = (action as Update).payload;
      return {
        ...state,
        tempEvent: update(tempEvent, key, value),
      };
    case ActionType.SET_DETAIL_EVENT:
      return {
        ...state,
        isShowFractionDialog: true,
        detailEvent: (action as SetDetailEvent).payload,
      };
    case ActionType.SET_TEMP_EVENT:
      return {
        ...state,
        tempEvent: (action as SetTempEvent).payload,
      };
    case ActionType.SET_TARGET_GRANT_HISTORY_RECORD_ID:
      return {
        ...state,
        targetGrantHistoryRecordId: (action as SetTargetGrantHistoryRecordId)
          .payload,
      };
    default:
      return state;
  }
};
