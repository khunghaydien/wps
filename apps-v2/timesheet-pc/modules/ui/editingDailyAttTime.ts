import { DailyAttTime } from '../../../domain/models/attendance/DailyAttTime';

type State = DailyAttTime;

const initialState: State = null;

const ACTIONS = {
  SET: 'TIMESHEET-PC/UI/EDITING_DAILY_ATT_TIME/SET',
  UNSET: 'TIMESHEET-PC/UI/EDITING_DAILY_ATT_TIME/UNSET',
  UPDATE: 'TIMESHEET-PC/UI/EDITING_DAILY_ATT_TIME/UPDATE',
  UPDATE_REST_TIME: 'TIMESHEET-PC/UI/EDITING_DAILY_ATT_TIME/UPDATE_REST_TIME',
  ADD_REST_TIME: 'TIMESHEET-PC/UI/EDITING_DAILY_ATT_TIME/ADD_REST_TIME',
  DELETE_REST_TIME: 'TIMESHEET-PC/UI/EDITING_DAILY_ATT_TIME/DELETE_REST_TIME',
} as const;

export const actions = {
  set: (dailyAttTime: DailyAttTime) => ({
    type: ACTIONS.SET,
    payload: dailyAttTime,
  }),

  unset: () => ({
    type: ACTIONS.UNSET,
  }),

  update: (key, value) => ({
    type: ACTIONS.UPDATE,
    payload: { key, value },
  }),

  updateRestTime: (index, key, value) => ({
    type: ACTIONS.UPDATE_REST_TIME,
    payload: { index, key, value },
  }),

  addRestTime: () => ({
    type: ACTIONS.ADD_REST_TIME,
  }),

  deleteRestTime: (index) => ({
    type: ACTIONS.DELETE_REST_TIME,
    payload: index,
  }),
};

type Actions =
  | ReturnType<typeof actions.set>
  | ReturnType<typeof actions.unset>
  | ReturnType<typeof actions.update>
  | ReturnType<typeof actions.updateRestTime>
  | ReturnType<typeof actions.addRestTime>
  | ReturnType<typeof actions.deleteRestTime>;

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

    case ACTIONS.UPDATE_REST_TIME: {
      const restTimes = state.restTimes.map((restTime, index) => {
        return index === action.payload.index
          ? { ...restTime, [action.payload.key]: action.payload.value }
          : restTime;
      });
      return { ...state, restTimes };
    }

    case ACTIONS.ADD_REST_TIME: {
      const restTimes = [...state.restTimes, { start: '', end: '' }];
      return { ...state, restTimes };
    }

    case ACTIONS.DELETE_REST_TIME: {
      const restTimes = state.restTimes.filter(
        (item, index) => index !== action.payload
      );
      return { ...state, restTimes };
    }

    default:
      return state;
  }
}
