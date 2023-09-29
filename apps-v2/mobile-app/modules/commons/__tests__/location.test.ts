// @ts-nocheck
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { LOCATION_FETCH_STATUS } from '../../../../domain/models/Location';

import reducer, * as location from '../location';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const createStateLogger = () => jest.fn().mockImplementation(reducer);

const runReducer =
  (mock?: (...args: Array<any>) => any) =>
  (state?: { [key: string]: any }) =>
  (actions: Array<any>) => {
    const $mock = mock || createStateLogger();
    $mock.mockReturnValueOnce(state);
    return actions.reduce(
      (newState, action) => $mock(newState, action),
      $mock()
    );
  };

const getPrivate = (
  name: string // eslint-disable-next-line no-underscore-dangle
) => reducer.__get__(name);

const ACTION_TYPES = getPrivate('ACTIONS');

describe('location', () => {
  describe('unset()', () => {
    test('should initailze', () => {
      const initialState = {
        latitude: 1,
        longitude: 2,
        fetchTime: 4,
        fetchStatus: LOCATION_FETCH_STATUS.Success,
        watchPositionID: 5,
      };
      const result = {
        latitude: null,
        longitude: null,
        fetchTime: null,
        fetchStatus: LOCATION_FETCH_STATUS.None,
        watchPositionID: null,
      };
      const logger = createStateLogger();
      const store = mockStore(runReducer(logger)(initialState));

      store.dispatch(location.unset());

      const actions = store.getActions();
      const state = store.getState();

      expect(actions).toEqual([
        {
          type: ACTION_TYPES.UNSET,
        },
      ]);
      expect(state).toEqual(result);
      expect(logger).toHaveReturnedWith(initialState);
    });
  });

  describe('set() : private', () => {
    test(`should dispatch a action and change fetchStatus to "${LOCATION_FETCH_STATUS.Success}"`, () => {
      const store = mockStore(runReducer()());

      store.dispatch(getPrivate('set')(1, 2, 3));

      const actions = store.getActions();
      const state = store.getState();

      expect(actions).toEqual([
        {
          type: ACTION_TYPES.SET,
          payload: {
            latitude: 1,
            longitude: 2,
            fetchTime: 3,
          },
        },
      ]);

      expect(state).toEqual({
        latitude: 1,
        longitude: 2,
        fetchTime: 3,
        fetchStatus: LOCATION_FETCH_STATUS.Success,
        watchPositionID: null,
      });
    });
  });

  describe('fail() : private', () => {
    test(`should dispatch a action and change fetchStatus to "${LOCATION_FETCH_STATUS.Failure}"`, () => {
      const initialState = {
        latitude: 1,
        longitude: 2,
        fetchTime: 4,
        fetchStatus: LOCATION_FETCH_STATUS.Success,
        watchPositionID: 5,
      };
      const finalState = {
        latitude: null,
        longitude: null,
        fetchTime: null,
        fetchStatus: LOCATION_FETCH_STATUS.Failure,
        watchPositionID: 5,
      };
      const logger = createStateLogger();
      const store = mockStore(runReducer(logger)(initialState));

      store.dispatch(getPrivate('fail')());

      const actions = store.getActions();
      const state = store.getState();

      expect(actions).toEqual([
        {
          type: ACTION_TYPES.FAIL,
        },
      ]);
      expect(state).toEqual(finalState);
      expect(logger).toHaveReturnedWith(initialState, finalState);
    });
  });

  describe('startFetching() : private', () => {
    test(`should dispatch a action and change fetchStatus to "${LOCATION_FETCH_STATUS.Fetching}"`, () => {
      const initialState = {
        latitude: 1,
        longitude: 2,
        fetchTime: 4,
        fetchStatus: LOCATION_FETCH_STATUS.Success,
        watchPositionID: 5,
      };
      const finalState = {
        latitude: null,
        longitude: null,
        fetchTime: null,
        fetchStatus: LOCATION_FETCH_STATUS.Fetching,
        watchPositionID: 5,
      };
      const logger = createStateLogger();
      const store = mockStore(runReducer(logger)(initialState));

      store.dispatch(getPrivate('startFetching')());

      const actions = store.getActions();
      const state = store.getState();

      expect(actions).toEqual([
        {
          type: ACTION_TYPES.START_FETCHING,
        },
      ]);
      expect(state).toEqual(finalState);
      expect(logger).toHaveReturnedWith(initialState, finalState);
    });
  });

  describe('setWatchPositionID() : private', () => {
    test(`should set value`, () => {
      const initialState = {
        latitude: 1,
        longitude: 2,
        fetchTime: 4,
        fetchStatus: LOCATION_FETCH_STATUS.Success,
        watchPositionID: 1,
      };
      const finalState = {
        latitude: 1,
        longitude: 2,
        fetchTime: 4,
        fetchStatus: LOCATION_FETCH_STATUS.Success,
        watchPositionID: 2,
      };
      const logger = createStateLogger();
      const store = mockStore(runReducer(logger)(initialState));

      store.dispatch(getPrivate('setWatchPositionID')(2));

      const actions = store.getActions();
      const state = store.getState();

      expect(actions).toEqual([
        {
          type: ACTION_TYPES.SET_WATCH_POSITION_ID,
          payload: 2,
        },
      ]);
      expect(state).toEqual(finalState);
      expect(logger).toHaveReturnedWith(initialState, finalState);
    });
  });

  describe('clearWatchPositionID() : private', () => {
    test(`should clear value`, () => {
      const initialState = {
        latitude: 1,
        longitude: 2,
        fetchTime: 4,
        fetchStatus: LOCATION_FETCH_STATUS.Success,
        watchPositionID: 1,
      };
      const finalState = {
        latitude: 1,
        longitude: 2,
        fetchTime: 4,
        fetchStatus: LOCATION_FETCH_STATUS.Success,
        watchPositionID: null,
      };
      const logger = createStateLogger();
      const store = mockStore(runReducer(logger)(initialState));

      store.dispatch(getPrivate('clearWatchPositionID')());

      const actions = store.getActions();
      const state = store.getState();

      expect(actions).toEqual([
        {
          type: ACTION_TYPES.CLEAR_WATCH_POSITION_ID,
        },
      ]);
      expect(state).toEqual(finalState);
      expect(logger).toHaveReturnedWith(initialState, finalState);
    });
  });

  describe('with navitator.geolcation', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: {
          geolocation: {
            clearWatch: jest.fn(),
            watchPosition: jest.fn(),
            getCurrentPosition: jest.fn(),
          },
        },
        writable: true,
      });
    });

    describe('clearWatch()', () => {
      test('should call navigator.geolocation.clearWatch', () => {
        const store = mockStore(runReducer()());

        store.dispatch(location.clearWatch(1));

        const actions = store.getActions();
        expect(actions).toEqual([
          {
            type: ACTION_TYPES.CLEAR_WATCH_POSITION_ID,
          },
        ]);
        expect(global.navigator.geolocation.clearWatch).toHaveBeenCalledWith(1);
      });
    });

    describe('onFailedToFetchLocation()', () => {
      test(`if don't have id, should change status to "${LOCATION_FETCH_STATUS.Fetching}"`, () => {
        const store = mockStore(runReducer()());

        store.dispatch(location.onFailedToFetchLocation());

        const actions = store.getActions();
        expect(actions).toEqual([
          {
            type: ACTION_TYPES.FAIL,
          },
        ]);
        expect(global.navigator.geolocation.clearWatch).not.toHaveBeenCalled();
      });

      test(`if have id, should call clearWatch()`, () => {
        const store = mockStore(runReducer()());

        store.dispatch(location.onFailedToFetchLocation(1));

        const actions = store.getActions();
        expect(actions).toEqual([
          {
            type: ACTION_TYPES.CLEAR_WATCH_POSITION_ID,
          },
          {
            type: ACTION_TYPES.FAIL,
          },
        ]);

        expect(global.navigator.geolocation.clearWatch).toHaveBeenCalledWith(1);
      });
    });

    describe('startFetchLocation()', () => {
      test('if success, should call set()', async () => {
        expect.hasAssertions();
        const position = {
          coords: {
            latitude: 1,
            longitude: 2,
          },
          timestamp: 1000,
        } as GeolocationPosition;
        const mockWatchPositon = jest.spyOn(
          global.navigator.geolocation,
          'watchPosition'
        );
        const promise = new Promise((resolve) => {
          mockWatchPositon.mockImplementation((success) => {
            const id = setTimeout(() => {
              success(position);
              clearTimeout(id);
              // @ts-ignore
              resolve();
            });
            return 1;
          });
        });

        const store = mockStore(runReducer()());

        await store.dispatch(location.startFetchLocation(1));
        await promise;

        const actions = store.getActions();

        expect(actions).toHaveLength(3);
        expect(actions[0]).toEqual({
          type: ACTION_TYPES.START_FETCHING,
        });
        expect(actions.slice(1)).toEqual(
          expect.arrayContaining([
            {
              type: ACTION_TYPES.SET_WATCH_POSITION_ID,
              payload: 1,
            },
            {
              type: ACTION_TYPES.SET,
              payload: {
                latitude: 1,
                longitude: 2,
                fetchTime: 1000,
              },
            },
          ])
        );
        expect(global.navigator.geolocation.watchPosition).toHaveBeenCalled();
      });

      test('if failure, should call onFailedToFetchLocation()', async () => {
        expect.hasAssertions();
        const promise = new Promise((resolve) => {
          global.navigator.geolocation.watchPosition.mockImplementation(
            (success, fail) => {
              const id = setTimeout(() => {
                fail(1);
                clearTimeout(id);
                // @ts-ignore
                resolve();
              });
              return 1;
            }
          );
        });

        const store = mockStore(runReducer()());

        await store.dispatch(location.startFetchLocation(1));
        await promise;

        const actions = store.getActions();
        const state = store.getState();

        expect(actions).toEqual([
          {
            type: ACTION_TYPES.START_FETCHING,
          },
          {
            type: ACTION_TYPES.SET_WATCH_POSITION_ID,
            payload: 1,
          },
          {
            type: ACTION_TYPES.CLEAR_WATCH_POSITION_ID,
          },
          {
            type: ACTION_TYPES.FAIL,
          },
        ]);
        expect(state).toEqual({
          latitude: null,
          longitude: null,
          fetchTime: null,
          fetchStatus: LOCATION_FETCH_STATUS.Failure,
          watchPositionID: null,
        });
        expect(global.navigator.geolocation.clearWatch).toHaveBeenCalled();
        expect(global.navigator.geolocation.watchPosition).toHaveBeenCalled();
      });

      test(`if don't have geolocation, should call onFailedToFetchLocation()`, async () => {
        expect.hasAssertions();
        global.navigator = {};

        const store = mockStore(runReducer()());

        await store.dispatch(location.startFetchLocation(1));

        const actions = store.getActions();
        const state = store.getState();

        expect(actions).toEqual([
          {
            type: ACTION_TYPES.START_FETCHING,
          },
          {
            type: ACTION_TYPES.FAIL,
          },
        ]);
        expect(state).toEqual({
          latitude: null,
          longitude: null,
          fetchTime: null,
          fetchStatus: LOCATION_FETCH_STATUS.Failure,
          watchPositionID: null,
        });
      });
    });

    describe('endFetchLocation', () => {
      test(`if have id, should clear id and change status to "${LOCATION_FETCH_STATUS.None}"`, () => {
        const store = mockStore(runReducer()());

        store.dispatch(location.endFetchLocation(1));

        const actions = store.getActions();

        expect(actions).toEqual([
          {
            type: ACTION_TYPES.CLEAR_WATCH_POSITION_ID,
          },
          {
            type: ACTION_TYPES.UNSET,
          },
        ]);
        expect(global.navigator.geolocation.clearWatch).toHaveBeenCalledWith(1);
      });

      test(`if don't have id, should change status to "${LOCATION_FETCH_STATUS.None}"`, () => {
        const store = mockStore(runReducer()());

        store.dispatch(location.endFetchLocation());

        const actions = store.getActions();

        expect(actions).toEqual([
          {
            type: ACTION_TYPES.UNSET,
          },
        ]);
        expect(global.navigator.geolocation.clearWatch).not.toHaveBeenCalled();
      });
    });

    describe('fetchLocation()', () => {
      test('if success, should call set()', async () => {
        expect.hasAssertions();
        const position = {
          coords: {
            latitude: 1,
            longitude: 2,
          },
          timestamp: 1000,
        };

        global.navigator.geolocation.getCurrentPosition = jest.fn((success) => {
          success(position);
        });

        const store = mockStore(runReducer()());

        await store.dispatch(location.fetchLocation());

        const actions = store.getActions();
        const state = store.getState();

        expect(actions).toEqual([
          {
            type: ACTION_TYPES.START_FETCHING,
          },
          {
            type: ACTION_TYPES.SET,
            payload: {
              latitude: 1,
              longitude: 2,
              fetchTime: 1000,
            },
          },
        ]);
        expect(state).toEqual({
          latitude: 1,
          longitude: 2,
          fetchTime: 1000,
          fetchStatus: LOCATION_FETCH_STATUS.Success,
          watchPositionID: null,
        });
        expect(
          global.navigator.geolocation.getCurrentPosition
        ).toHaveBeenCalled();
      });

      test('if failure, should call fail()', async () => {
        expect.hasAssertions();

        global.navigator.geolocation.getCurrentPosition = jest.fn(
          (success, fail) => {
            fail();
          }
        );

        const store = mockStore(runReducer()());

        await store.dispatch(location.fetchLocation());

        const actions = store.getActions();
        const state = store.getState();

        expect(actions).toEqual([
          {
            type: ACTION_TYPES.START_FETCHING,
          },
          {
            type: ACTION_TYPES.FAIL,
          },
        ]);
        expect(state).toEqual({
          latitude: null,
          longitude: null,
          fetchTime: null,
          fetchStatus: LOCATION_FETCH_STATUS.Failure,
          watchPositionID: null,
        });
        expect(
          global.navigator.geolocation.getCurrentPosition
        ).toHaveBeenCalled();
      });

      test(`if don't have geolocation, should call fail()`, async () => {
        expect.hasAssertions();
        global.navigator = {};

        const store = mockStore(runReducer()());

        await store.dispatch(location.fetchLocation());

        const actions = store.getActions();
        const state = store.getState();

        expect(actions).toEqual([
          {
            type: ACTION_TYPES.FAIL,
          },
        ]);
        expect(state).toEqual({
          latitude: null,
          longitude: null,
          fetchTime: null,
          fetchStatus: LOCATION_FETCH_STATUS.Failure,
          watchPositionID: null,
        });
      });
    });
  });
});
