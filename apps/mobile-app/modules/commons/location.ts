import {
  LOCATION_FETCH_STATUS,
  LocationFetchStatus,
} from '../../../domain/models/Location';

import { AppDispatch } from './AppThunk';

export type State = {
  latitude: number | null;
  longitude: number | null;
  // 位置情報取得時間
  fetchTime: number | null;
  fetchStatus: LocationFetchStatus;
  // 位置情報取得ハンドラーID
  watchPositionID: number | null;
};

type Action = {
  type: string;
  payload?: any;
};

const ACTIONS = {
  UNSET: 'LOCATION/UNSET',
  SET: 'LOCATION/SET',
  FAIL: 'LOCATION/FAIL',
  START_FETCHING: 'LOCATION/START_FETCHING',
  SET_WATCH_POSITION_ID: 'LOCATION/SET_WATCH_POSITION_ID',
  CLEAR_WATCH_POSITION_ID: 'LOCATION/CLEAR_WATCH_POSITION_ID',
} as const;

export const unset = () => ({
  type: ACTIONS.UNSET,
});

const set = (
  latitude: number,
  longitude: number,
  fetchTime: number // 位置情報取得時間
) => ({
  type: ACTIONS.SET,
  payload: {
    latitude,
    longitude,
    fetchTime,
  },
});

const fail = () => ({
  type: ACTIONS.FAIL,
});

const startFetching = () => ({
  type: ACTIONS.START_FETCHING,
});

const setWatchPositionID = (watchPositionID: number) => ({
  type: ACTIONS.SET_WATCH_POSITION_ID,
  payload: watchPositionID,
});

const clearWatchPositionID = () => ({
  type: ACTIONS.CLEAR_WATCH_POSITION_ID,
});

/**
 * watchPositionID を削除します。
 *
 * navigator.geolocation.watchPosition 用の関数です。
 */
export const clearWatch =
  (watchPositionID: number) => (dispatch: AppDispatch) => {
    navigator.geolocation.clearWatch(watchPositionID);
    dispatch(clearWatchPositionID());
  };

/**
 * Error を発生させます。
 *
 * navigator.geolocation.watchPosition 用の関数です。
 */
export const onFailedToFetchLocation =
  (id?: number) =>
  (dispatch: AppDispatch): void => {
    if (id !== undefined && id !== null) {
      dispatch(clearWatch(id));
    }
    dispatch(fail());
  };

/**
 * 位置情報取得開始時に実行させます。
 *
 * 現在は使用しておりませんが、
 * 実装を watchPosition にしたり getCurrentPosition にしたりと
 * 変更が激しかったので残してあります。
 */
export const startFetchLocation = () => (dispatch: AppDispatch) => {
  dispatch(startFetching());
  if ('geolocation' in navigator) {
    return new Promise((resolve) => {
      const watchPositionID = navigator.geolocation.watchPosition(
        (position) => {
          dispatch(
            set(
              position.coords.latitude,
              position.coords.longitude,
              position.timestamp
            )
          );
        },
        () => {
          dispatch(onFailedToFetchLocation(watchPositionID));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
      resolve(watchPositionID);
    }).then((id: number) => dispatch(setWatchPositionID(id)));
  } else {
    return dispatch(onFailedToFetchLocation());
  }
};

/**
 * 位置情報取得終了時に実行させます。
 *
 * 現在は使用しておりませんが、
 * 実装を watchPosition にしたり getCurrentPosition にしたりと
 * 変更が激しかったので残してあります。
 */
export const endFetchLocation =
  (watchPositionID: number | null | undefined) => (dispatch: AppDispatch) => {
    if (watchPositionID !== undefined && watchPositionID !== null) {
      dispatch(clearWatch(watchPositionID));
    }
    dispatch(unset());
  };

/**
 * ポジションを一回だけ更新します。
 *
 * startFetchLocation とは併用できません。
 */
export const fetchLocation = () => async (dispatch: AppDispatch) => {
  if ('geolocation' in navigator) {
    try {
      dispatch(startFetching());
      const position = (await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      })) as any;
      dispatch(
        set(
          position.coords.latitude,
          position.coords.longitude,
          position.timestamp
        )
      );
    } catch (e) {
      dispatch(fail());
    }
  } else {
    dispatch(fail());
  }
};

const initialState: State = {
  latitude: null,
  longitude: null,
  fetchTime: null,
  fetchStatus: LOCATION_FETCH_STATUS.None,
  watchPositionID: null,
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.UNSET:
      return initialState;
    case ACTIONS.SET:
      if (action.payload === null || action.payload === undefined) {
        return state;
      }

      return {
        ...state,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        fetchTime: action.payload.fetchTime,
        fetchStatus: LOCATION_FETCH_STATUS.Success,
      };
    case ACTIONS.FAIL:
      return {
        ...state,
        latitude: null,
        longitude: null,
        fetchTime: null,
        fetchStatus: LOCATION_FETCH_STATUS.Failure,
      };
    case ACTIONS.START_FETCHING:
      return {
        ...state,
        latitude: null,
        longitude: null,
        fetchTime: null,
        fetchStatus: LOCATION_FETCH_STATUS.Fetching,
      };
    case ACTIONS.SET_WATCH_POSITION_ID:
      return {
        ...state,
        watchPositionID: action.payload,
      };
    case ACTIONS.CLEAR_WATCH_POSITION_ID:
      return {
        ...state,
        watchPositionID: null,
      };
    default:
      return state;
  }
};
