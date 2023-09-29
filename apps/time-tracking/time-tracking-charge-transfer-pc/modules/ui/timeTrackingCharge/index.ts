import { endOfMonth, startOfMonth } from 'date-fns';

// State
type SrcTask = Readonly<{
  jobId: string;
  jobCode: string;
  jobName: string;
  workCategoryId: string;
  workCategoryCode: string;
  workCategoryName: string;
}>;

type DestTask = Readonly<{
  jobId: string;
  jobCode: string;
  jobName: string;
  validTo: string;
  validFrom: string;
  workCategoryId: string;
  workCategoryCode: string;
  workCategoryName: string;
}>;

export type State = Readonly<{
  startDate: Date;
  endDate: Date;
  srcTask: SrcTask;
  destTask: DestTask;
  summaryId: string;
  summaryPeriod: {
    startDate: Date;
    endDate: Date;
  };
}>;

const initialSrcTask: SrcTask = {
  jobId: '',
  jobCode: '',
  jobName: '',
  workCategoryId: '',
  workCategoryCode: '',
  workCategoryName: '',
};
const initialDestTask: DestTask = {
  ...initialSrcTask,
  validFrom: '',
  validTo: '',
};

export const initialState: State = {
  startDate: startOfMonth(new Date()),
  endDate: endOfMonth(new Date()),
  srcTask: initialSrcTask,
  destTask: initialDestTask,
  summaryId: '',
  summaryPeriod: {
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  },
};

// ActionCreator

export const action = {
  SELECT_START_DATE: (date: Date) =>
    ({
      type: '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/SELECT_START_DATE',
      payload: date,
    } as const),
  SELECT_END_DATE: (date: Date) =>
    ({
      type: '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/SELECT_END_DATE',
      payload: date,
    } as const),
  SELECT_SRC_TASK: (task: Partial<SrcTask>) =>
    ({
      type: '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/SELECT_SRC_TASK',
      payload: task,
    } as const),
  SELECT_DEST_TASK: (task: Partial<DestTask>) =>
    ({
      type: '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/SELECT_DEST_TASK',
      payload: task,
    } as const),
  SELECT_SUMMARY: (summary: {
    summaryId: string;
    summaryPeriod: {
      startDate: Date;
      endDate: Date;
    };
  }) =>
    ({
      type: '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/SELECT_SUMMARY',
      payload: summary,
    } as const),
  RESET: () =>
    ({
      type: '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/RESET',
    } as const),
};

// Action
type ActionCreators = typeof action[keyof typeof action];
type Action = ReturnType<ActionCreators>;

// Reducer

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/SELECT_START_DATE': {
      return {
        ...state,
        startDate: action.payload,
      };
    }
    case '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/SELECT_END_DATE': {
      return {
        ...state,
        endDate: action.payload,
      };
    }
    case '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/SELECT_SRC_TASK': {
      return {
        ...state,
        srcTask: {
          ...state.srcTask,
          ...action.payload,
        },
      };
    }
    case '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/SELECT_DEST_TASK': {
      return {
        ...state,
        destTask: {
          ...state.destTask,
          ...action.payload,
        },
      };
    }
    case '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/SELECT_SUMMARY': {
      const { summaryId, summaryPeriod } = action.payload;
      return {
        ...state,
        summaryId,
        summaryPeriod,
      };
    }
    case '/TIME-TRACKING-CHARGE-TRANSFER-PC/MODULES/UI/TIME_TRACKING_CHARGE/RESET': {
      return {
        ...state,
        srcTask: initialSrcTask,
        destTask: initialDestTask,
        summaryId: '',
      };
    }
    default:
      return state;
  }
}
