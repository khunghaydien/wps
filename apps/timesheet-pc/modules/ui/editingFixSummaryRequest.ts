import { AttFixSummaryRequest } from '@apps/domain/models/attendance/AttFixSummaryRequest';

type State = AttFixSummaryRequest;

const initialState: State = null;

const ACTIONS = {
  SET: 'TIMESHEET-PC/UI/EDITING_FIX_SUMMARY_REQUEST/SET',
  UNSET: 'TIMESHEET-PC/UI/EDITING_FIX_SUMMARY_REQUEST/UNSET',
  UPDATE: 'TIMESHEET-PC/UI/EDITING_FIX_SUMMARY_REQUEST/UPDATE',
} as const;

export const actions = {
  set: (attFixRequest: AttFixSummaryRequest) => ({
    type: ACTIONS.SET,
    payload: attFixRequest,
  }),

  unset: () => ({
    type: ACTIONS.UNSET,
  }),

  update: (key: keyof AttFixSummaryRequest, value: string) => ({
    type: ACTIONS.UPDATE,
    payload: { key, value },
  }),
};

type Actions =
  | ReturnType<typeof actions.set>
  | ReturnType<typeof actions.unset>
  | ReturnType<typeof actions.update>;

export default function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;

    case ACTIONS.UNSET:
      return null;

    case ACTIONS.UPDATE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    default:
      return state;
  }
}
