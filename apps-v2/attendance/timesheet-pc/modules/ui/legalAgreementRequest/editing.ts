import {
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
  getPerformableDisableAction,
  getPerformableEditAction,
  LegalAgreementRequest,
} from '@attendance/domain/models/LegalAgreementRequest';
import { Code } from '@attendance/domain/models/LegalAgreementRequestType';

import ROOT from './actionType';

export type State = {
  id: string | null;
  requestType: Code | null;
  editAction: EditAction;
  disableAction: DisableAction;
  isEditing: boolean;
};

const initialState: State = {
  id: null,
  requestType: null,
  editAction: EDIT_ACTION.NONE,
  disableAction: DISABLE_ACTION.NONE,
  isEditing: false,
};

const ACTION_TYPE_ROOT = `${ROOT}/EDITING` as const;

const ACTION_TYPE = {
  INIT: `${ACTION_TYPE_ROOT}/INIT`,
  START: `${ACTION_TYPE_ROOT}/START`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type Init = {
  type: typeof ACTION_TYPE.INIT;
  payload: {
    request: LegalAgreementRequest;
    isEditing: boolean;
  };
};

type Start = {
  type: typeof ACTION_TYPE.START;
};

type Clear = {
  type: typeof ACTION_TYPE.CLEAR;
};

type Action = Init | Start | Clear;

export const actions = {
  initialize: (request: LegalAgreementRequest, isEditing = false): Init => ({
    type: ACTION_TYPE.INIT,
    payload: {
      request,
      isEditing,
    },
  }),
  startEditing: (): Start => ({
    type: ACTION_TYPE.START,
  }),
  clear: (): Clear => ({
    type: ACTION_TYPE.CLEAR,
  }),
};

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPE.INIT: {
      const { request, isEditing } = action.payload;
      const editAction = getPerformableEditAction(request);
      const disableAction = getPerformableDisableAction(request);
      return {
        id: request.id,
        requestType: request.requestType,
        isEditing: editAction === EDIT_ACTION.CREATE || isEditing,
        editAction,
        disableAction,
      };
    }

    case ACTION_TYPE.START: {
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
