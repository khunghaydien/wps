import { createSelector } from 'reselect';
import { $Shape } from 'utility-types';
import uuidV4 from 'uuid/v4';

import { AppDispatch } from './AppThunk';

// Loading Id

type LoadingId = string;

// State

type State = $Shape<{
  [LoadingId: string]: {
    /* NOTE
     * Add loading type or loading message?
     *
     * In the future, user maybe want more kindly loading messages.
     * e.g. Requesting..., Searching... and so on,
     *
     * So we reserved empty object for those additonal information.
     */
  };
}>;

const initialState: State = {};

// Selectors

const selectIsShowing = (state: State): boolean => {
  return Object.keys(state).length > 0;
};

/**
 * A flag showing or hiding loader
 */
export const isShowing = createSelector(
  selectIsShowing,
  (value: boolean): boolean => value
);

// Actions

type StartLoading = {
  type: 'START_LOADING';
  payload: LoadingId;
};

type EndLoading = {
  type: 'END_LOADING';
  payload: LoadingId;
};

type Action = StartLoading | EndLoading;

/**
 * Update state for starting loading.
 * startLoading returns unique id corresponding to each loading.
 * If you would update state to stop loading, then you should specify id to
 * endLoaindg method.
 */
export const startLoading =
  () =>
  (dispatch: AppDispatch): LoadingId => {
    const uuid = uuidV4();
    dispatch({
      type: 'START_LOADING',
      payload: uuid,
    });
    return uuid;
  };

/**
 * Update state for ending loading.
 * Call to stop loading.
 * Unique id returned by startLoading is required to a parameter.
 * @param id loading id
 */
export const endLoading = (id: LoadingId): EndLoading => ({
  type: 'END_LOADING',
  payload: id,
});

type ThunkDispatch = (dispatch: AppDispatch) => Promise<any>;

/**
 * Execute promise actions with loading.
 * @param Promise actions
 * @return a value computed by Promise actions.
 *
 * actions are executed in parallel.
 * If you have to ensure execution sequence,
 * you should chain Promise actions with `then`
 *
 * @example
 *
 * const loadData = () =>
 *   withLoading(
 *     loadRequest(),
 *     loadClaimTypeMaster(),
 *   )
 *   .catch(err => catchApiError(err, {isContinuable: true}));
 * // typeof loadData := ThunkDispatch<8>
 */
export const withLoading = <T>(
  ...actions: Array<(AppDispatch: AppDispatch) => Promise<T>>
): ThunkDispatch => {
  return (dispatch: AppDispatch): Promise<any> => {
    const id: LoadingId = dispatch(startLoading());
    return Promise.all(actions.map(dispatch))
      .then((result) => {
        dispatch(endLoading(id));
        return result;
      })
      .catch((err) => {
        dispatch(endLoading(id));
        throw err;
      });
  };
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'START_LOADING': {
      const id = (action as StartLoading).payload;
      return {
        ...state,
        [id]: {},
      };
    }

    case 'END_LOADING': {
      const id = (action as EndLoading).payload;
      const clone = { ...state };
      delete clone[id];
      return clone;
    }

    default: {
      return state;
    }
  }
};
