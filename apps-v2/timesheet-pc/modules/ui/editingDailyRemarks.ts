import { DailyRemarks } from '../../../domain/models/attendance/AttDailyRecord';
import AttRecord from '../../models/AttRecord';

export type State = DailyRemarks & {
  recordDate: string;
};

const initialState: State = null;

const ACTIONS = {
  SET: 'TIMESHEET-PC/UI/EDITING_DAILY_REMARKS/SET',
  UNSET: 'TIMESHEET-PC/UI/EDITING_DAILY_REMARKS/UNSET',
  UPDATE: 'TIMESHEET-PC/UI/EDITING_DAILY_REMARKS/UPDATE',
} as const;

export const actions = {
  set: (record: AttRecord) => ({
    type: ACTIONS.SET,
    payload: record,
  }),

  unset: () => ({
    type: ACTIONS.UNSET,
  }),

  update: (key: keyof State, value: State[keyof State]) => ({
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
      return {
        recordId: action.payload.id,
        recordDate: action.payload.recordDate,
        remarks: action.payload.remarks,
      };

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
