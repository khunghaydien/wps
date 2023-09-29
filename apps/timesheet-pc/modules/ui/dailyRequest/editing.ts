import {
  AttDailyRequest,
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
  getPerformableDisableAction,
  getPerformableEditAction,
} from '../../../../domain/models/attendance/AttDailyRequest';
import { Code } from '../../../../domain/models/attendance/AttDailyRequestType';
import { TimesheetFromRemote } from '../../../../domain/models/attendance/Timesheet';

export type State = {
  id: string | null;
  requestTypeCode: Code | null;
  editAction: EditAction;
  disableAction: DisableAction;
  isEditing: boolean;
};

const initialState: State = {
  id: null,
  requestTypeCode: null,
  editAction: EDIT_ACTION.None,
  disableAction: DISABLE_ACTION.None,
  isEditing: false,
};

type Initialize = {
  type: 'TIMESHEET-PC/UI/DAILY_REQUEST/EDITING/INITIALIZE';
  payload: {
    request: AttDailyRequest;
    isEditing: boolean;
  };
};

// TODO: このmoduleでは使われていないので、他のactionに紐付いていないことを確認して削除する
type ResetRequest = {
  type: 'TIMESHEET-PC/UI/DAILY_REQUEST/EDITING/RESET_REQUEST';
  // FIXME: 本来は Timesheet モデルを使いたいのですが、
  // PC 側がまだドメインの Timesheet モデルに対応してないため API から返されるモデルを利用しております。
  payload: TimesheetFromRemote;
};

type StartEditing = {
  type: 'TIMESHEET-PC/UI/DAILY_REQUEST/EDITING/START_EDITING';
};

type Clear = {
  type: 'TIMESHEET-PC/UI/DAILY_REQUEST/EDITING/CLEAR';
};

type Action = Initialize | ResetRequest | StartEditing | Clear;

const ACTION_TYPE = {
  INITIALIZE:
    'TIMESHEET-PC/UI/DAILY_REQUEST/EDITING/INITIALIZE' as Initialize['type'],
  RESET_REQUEST:
    'TIMESHEET-PC/UI/DAILY_REQUEST/EDITING/RESET_REQUEST' as ResetRequest['type'],
  START_EDITING:
    'TIMESHEET-PC/UI/DAILY_REQUEST/EDITING/START_EDITING' as StartEditing['type'],
  CLEAR: 'TIMESHEET-PC/UI/DAILY_REQUEST/EDITING/CLEAR' as Clear['type'],
};

export const actions = {
  initialize: (request: AttDailyRequest, isEditing = false): Initialize => ({
    type: ACTION_TYPE.INITIALIZE,
    payload: {
      request,
      isEditing,
    },
  }),

  resetRequest: (timesheet: TimesheetFromRemote): ResetRequest => ({
    type: ACTION_TYPE.RESET_REQUEST,
    payload: timesheet,
  }),

  startEditing: (): StartEditing => ({
    type: ACTION_TYPE.START_EDITING,
  }),

  clear: (): Clear => ({
    type: ACTION_TYPE.CLEAR,
  }),
};

/**
 * @param {*} state
 * @param {Object} action
 * @returns {AttDailyRequest}
 */
export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPE.INITIALIZE: {
      const { request, isEditing } = action.payload;
      const editAction = getPerformableEditAction(request);
      const disableAction = getPerformableDisableAction(request);
      return {
        id: request.id,
        requestTypeCode: request.requestTypeCode,
        isEditing: editAction === EDIT_ACTION.Create || isEditing,
        editAction,
        disableAction,
      };
    }

    case ACTION_TYPE.START_EDITING: {
      return {
        ...state,
        isEditing: true,
      };
    }

    case ACTION_TYPE.CLEAR:
      return { ...initialState };

    default:
      return state;
  }
}
