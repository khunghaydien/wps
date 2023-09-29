import {
  AttDailyRequest,
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
  getPerformableDisableAction,
  getPerformableEditAction,
} from '../../../../../domain/models/attendance/AttDailyRequest';
import {
  CODE,
  Code,
} from '../../../../../domain/models/attendance/AttDailyRequestType';

export type State = {
  isEditing: boolean;
  id: string;
  requestTypeCode: Code;
  editAction: EditAction;
  disableAction: DisableAction;
};

const initialState: State = {
  isEditing: false,
  id: '',
  requestTypeCode: CODE.None,
  editAction: EDIT_ACTION.None,
  disableAction: DISABLE_ACTION.None,
};

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/DETAIL/INITIALIZE';
  payload: {
    target: AttDailyRequest;
    isEditing: boolean;
  };
};

type StartEditing = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/DETAIL/START_EDITING';
};

type Action = Initialize | StartEditing;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/DETAIL/INITIALIZE';

const START_EDITING: StartEditing['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/DETAIL/START_EDITING';

export const actions = {
  initialize: (target: AttDailyRequest, isEditing = false): Initialize => ({
    type: INITIALIZE,
    payload: {
      target,
      isEditing,
    },
  }),

  startEditing: (): StartEditing => ({
    type: START_EDITING,
  }),
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { target, isEditing } = action.payload;
      const editAction = getPerformableEditAction(target);
      const disableAction = getPerformableDisableAction(target);
      return {
        ...state,
        isEditing: editAction === EDIT_ACTION.Create || isEditing,
        id: target.id,
        requestTypeCode: target.requestTypeCode,
        editAction,
        disableAction,
      };
    }

    case START_EDITING:
      return {
        ...state,
        isEditing: true,
      };

    default:
      return state;
  }
};
