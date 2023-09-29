import { $PropertyType } from 'utility-types';

import { Job } from '../../../../domain/models/time-tracking/Job';

// State

export type Stream<T> = AsyncGenerator<
  ReadonlyArray<T>,
  ReadonlyArray<T>,
  void
>;

type State = {
  [key: string]: {
    // Lazy stream of Job
    stream: Stream<Job>;

    // Evaluated items of Job
    items: ReadonlyArray<Job>;

    // State representing stream is finished or not
    isDone: boolean;

    // State representing stream is aborted or not
    isAborted: boolean;
  };
};

export const initialState: State = {};

const initialValue = {
  *stream() {
    yield null;
    return null;
  },
  items: [],
  isDone: false,
  isAborted: false,
};

// Action

type Abort = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/ABORT';
  payload: {
    parentJobId: string | null | undefined;
  };
};

type Clear = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/CLEAR';
};

type Done = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/DONE';
  payload: {
    parentJobId: string | null | undefined;
  };
};

type EvalStream = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/EVAL_STREAM';
  payload: {
    parentJobId: string | null | undefined;
    rest: Stream<Job>;
    evaluatedItems: ReadonlyArray<Job>;
  };
};

type FetchSuccess = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/FETCH_SUCCESS';
  payload: {
    parentJobId: string | null | undefined;
    jobs: Stream<Job>;
  };
};

type Resume = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/RESUME';
  payload: {
    parentJobId: string | null | undefined;
  };
};

export const ABORT: $PropertyType<Abort, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/ABORT';

export const CLEAR: $PropertyType<Clear, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/CLEAR';

export const DONE: $PropertyType<Done, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/DONE';

export const EVAL_STREAM: $PropertyType<EvalStream, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/EVAL_STREAM';

export const FETCH_SUCCESS: $PropertyType<FetchSuccess, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/FETCH_SUCCESS';

export const RESUME: $PropertyType<Resume, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/ENTITY/JOBS/RESUME';

export const actions = {
  abort: (parentJobId: string | null | undefined): Abort => ({
    type: ABORT,
    payload: {
      parentJobId,
    },
  }),
  clear: (): Clear => ({
    type: CLEAR,
  }),
  done: (parentJobId: string | null | undefined): Done => ({
    type: DONE,
    payload: {
      parentJobId,
    },
  }),
  evalStream: (
    parentJobId: string | null | undefined,
    rest: Stream<Job>,
    evaluatedItems: ReadonlyArray<Job>
  ): EvalStream => ({
    type: EVAL_STREAM,
    payload: {
      parentJobId,
      rest,
      evaluatedItems,
    },
  }),
  fetchSuccess: (
    parentJobId: string | null | undefined,
    jobs: Stream<Job>
  ): FetchSuccess => ({
    type: FETCH_SUCCESS,
    payload: {
      parentJobId,
      jobs,
    },
  }),
  resume: (parentJobId: string | null | undefined): Resume => ({
    type: RESUME,
    payload: {
      parentJobId,
    },
  }),
};

type Action = Abort | Clear | Done | EvalStream | FetchSuccess | Resume;

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ABORT: {
      const { parentJobId = '' } = action.payload;
      const key = parentJobId || '';
      return {
        ...state,
        [key]: {
          ...state[key],
          isAborted: true,
        },
      };
    }

    case CLEAR: {
      for (const key of Object.keys(state)) {
        // @ts-ignore
        state[key].stream.return();
      }

      return initialState;
    }

    case DONE: {
      const { parentJobId = '' } = action.payload;
      const key = parentJobId || '';
      return {
        ...state,
        [key]: {
          ...state[key],
          isDone: true,
        },
      };
    }

    case EVAL_STREAM: {
      const { parentJobId = '', rest, evaluatedItems } = action.payload;
      const key = parentJobId || '';
      return {
        ...state,
        [key]: {
          ...state[key],
          stream: rest,
          items: [...(state[key].items || []), ...evaluatedItems],
          isDone: evaluatedItems.length === 0,
        },
      };
    }

    case FETCH_SUCCESS: {
      const parentJobId = action.payload.parentJobId || '';
      return {
        ...state,
        [parentJobId]: {
          ...state[parentJobId],
          ...initialValue,
          stream: action.payload.jobs,
        },
      };
    }

    case RESUME: {
      const { parentJobId = '' } = action.payload;
      const key = parentJobId || '';
      return {
        ...state,
        [key]: {
          ...state[key],
          isAborted: false,
        },
      };
    }

    default:
      return state;
  }
};
