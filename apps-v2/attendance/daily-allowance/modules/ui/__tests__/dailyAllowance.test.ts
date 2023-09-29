import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  CLEAR,
  FETCH_SUCCESS,
  initialState,
  SET_END_TIME,
  SET_HOURS,
  SET_QUANTITY,
  SET_START_TIME,
  SET_USER,
  TOGGLE_SELECTION,
} from '../dailyAllowance';
import { allowances, selectedTarget, user } from './mocks/dailyAllowance';

jest.mock('uuid/v4', () => {
  return (): string => 'testid#xxx';
});
jest.mock('nanoid', () => {
  return (): string => 'testid#xxx';
});

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(FETCH_SUCCESS, () => {
    // Action
    const next = reducer(initialState, actions.fetchSuccess(allowances as any));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(SET_USER, () => {
    // Action
    const next = reducer(initialState, actions.setUser(user as any));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(TOGGLE_SELECTION, () => {
    const initialState = {
      dailyRecordAllList: allowances,
      user: null,
    };
    // Action
    const next = reducer(
      initialState,
      actions.toggleSelection(selectedTarget as any)
    );

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(SET_START_TIME, () => {
    const initialState = {
      dailyRecordAllList: allowances,
      user: null,
    };
    // Action
    const next = reducer(
      initialState,
      actions.setStartTime(60, 'a2a1y000000A8OZAA4')
    );

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(SET_END_TIME, () => {
    const initialState = {
      dailyRecordAllList: allowances,
      user: null,
    };
    // Action
    const next = reducer(
      initialState,
      actions.setEndTime(120, 'a2a1y000000A8OZAA4')
    );

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(SET_HOURS, () => {
    const initialState = {
      dailyRecordAllList: allowances,
      user: null,
    };
    // Action
    const next = reducer(
      initialState,
      actions.setHours(30, 'a2a1y000000A8OZAA3')
    );

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(SET_QUANTITY, () => {
    const initialState = {
      dailyRecordAllList: allowances,
      user: null,
    };
    // Action
    const next = reducer(
      initialState,
      actions.setQuantity(200, 'a2a1y000000A8OZAA1')
    );

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(CLEAR, () => {
    // Action
    const next = reducer(initialState, actions.clear());

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
