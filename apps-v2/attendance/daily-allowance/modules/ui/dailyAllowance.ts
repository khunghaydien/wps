import { User } from '../../../../domain/models/User';
import { Allowances } from '../../models/attDailyAllowanceAll';

// State
export type State = {
  dailyRecordAllList: Allowances[];
  user: User;
};

export const initialState: State = {
  dailyRecordAllList: [],
  user: null,
};

// Actions
export const FETCH_SUCCESS =
  'TIMESHEET-PC/ENTITIES/DAILYDAILOGALLOWANCR/FETCH_SUCCESS';

export const TOGGLE_SELECTION =
  'TIMESHEET-PC/ENTITIES/DAILYDAILOGALLOWANCR/TOGGLE_SELECTION';

export const SET_USER = 'TIMESHEET-PC/ENTITIES/DAILYDAILOGALLOWANCR/SET_USER';

export const SET_HOURS = 'TIMESHEET-PC/ENTITIES/DAILYDAILOGALLOWANCR/SET_HOURS';

export const SET_START_TIME =
  'TIMESHEET-PC/ENTITIES/DAILYDAILOGALLOWANCR/SET_START_TIME';

export const SET_END_TIME =
  'TIMESHEET-PC/ENTITIES/DAILYDAILOGALLOWANCR/SET_END_TIME';

export const SET_QUANTITY =
  'TIMESHEET-PC/ENTITIES/DAILYDAILOGALLOWANCR/SET_QUANTITY';

export const CLEAR = 'TIMESHEET-PC/ENTITIES/DAILYDAILOGALLOWANCR/CLEAR';

type FetchSuccess = {
  type: typeof FETCH_SUCCESS;
  payload: {
    dailyRecordAllList: Allowances[];
  };
};

type ToggleSlection = {
  type: typeof TOGGLE_SELECTION;
  payload: Allowances;
};

type SetUser = {
  type: typeof SET_USER;
  payload: { user: User };
};

type SetHours = {
  type: typeof SET_HOURS;
  payload: {
    hours: number;
    allowanceId: string;
  };
};

type SetStartTime = {
  type: typeof SET_START_TIME;
  payload: {
    startTime: number;
    allowanceId: string;
  };
};

type SetEndTime = {
  type: typeof SET_END_TIME;
  payload: {
    endTime: number;
    allowanceId: string;
  };
};

type SetQuantity = {
  type: typeof SET_QUANTITY;
  payload: {
    quantity: number;
    allowanceId: string;
  };
};

type Clear = {
  type: typeof CLEAR;
};

export type Action =
  | FetchSuccess
  | ToggleSlection
  | SetUser
  | SetHours
  | SetStartTime
  | SetEndTime
  | SetQuantity
  | Clear;

export const actions = {
  fetchSuccess: (dailyRecordAllList: Allowances[]): FetchSuccess => ({
    type: FETCH_SUCCESS,
    payload: {
      dailyRecordAllList,
    },
  }),
  toggleSelection: (target: Allowances): ToggleSlection => ({
    type: TOGGLE_SELECTION,
    payload: target,
  }),
  setUser: (user: User): SetUser => ({
    type: SET_USER,
    payload: {
      user,
    },
  }),
  setHours: (hours: number, allowanceId: string): SetHours => ({
    type: SET_HOURS,
    payload: {
      hours,
      allowanceId,
    },
  }),
  setStartTime: (startTime: number, allowanceId: string): SetStartTime => ({
    type: SET_START_TIME,
    payload: {
      startTime,
      allowanceId,
    },
  }),
  setEndTime: (endTime: number, allowanceId: string): SetEndTime => ({
    type: SET_END_TIME,
    payload: {
      endTime,
      allowanceId,
    },
  }),
  setQuantity: (quantity: number, allowanceId: string): SetQuantity => ({
    type: SET_QUANTITY,
    payload: {
      quantity,
      allowanceId,
    },
  }),
  clear: (): Clear => ({
    type: CLEAR,
  }),
};

// Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      const { dailyRecordAllList } = (action as FetchSuccess).payload;
      return {
        ...state,
        dailyRecordAllList,
      };
    }

    case TOGGLE_SELECTION: {
      const payload = (action as ToggleSlection).payload;
      const clone = [...state.dailyRecordAllList];

      const index = state.dailyRecordAllList.findIndex(
        (allowanceRecord) => allowanceRecord.allowanceId === payload.allowanceId
      );
      clone[index] = {
        ...payload,
        isSelected: !payload.isSelected,
      };

      return {
        ...state,
        dailyRecordAllList: [...clone],
      };
    }

    case SET_USER: {
      const { user } = (action as SetUser).payload;
      return {
        ...state,
        user,
      };
    }

    case SET_HOURS: {
      const { hours, allowanceId } = (action as SetHours).payload;
      const clone = [...state.dailyRecordAllList];

      clone.forEach((item, index) => {
        if (item.allowanceId === allowanceId) {
          clone[index].totalTime = hours;
        }
      });

      return {
        ...state,
        dailyRecordAllList: [...clone],
      };
    }

    case SET_START_TIME: {
      const { startTime, allowanceId } = (action as SetStartTime).payload;
      const clone = [...state.dailyRecordAllList];

      clone.forEach((item, index) => {
        if (item.allowanceId === allowanceId) {
          clone[index].startTime = startTime;
        }
      });

      return {
        ...state,
        dailyRecordAllList: [...clone],
      };
    }

    case SET_END_TIME: {
      const { endTime, allowanceId } = (action as SetEndTime).payload;
      const clone = [...state.dailyRecordAllList];

      clone.forEach((item, index) => {
        if (item.allowanceId === allowanceId) {
          clone[index].endTime = endTime;
        }
      });

      return {
        ...state,
        dailyRecordAllList: [...clone],
      };
    }

    case SET_QUANTITY: {
      const { quantity, allowanceId } = (action as SetQuantity).payload;
      const clone = [...state.dailyRecordAllList];

      clone.forEach((item, index) => {
        if (item.allowanceId === allowanceId) {
          clone[index].quantity = quantity;
        }
      });

      return {
        ...state,
        dailyRecordAllList: [...clone],
      };
    }

    case CLEAR: {
      return initialState;
    }

    default:
      return state;
  }
};
