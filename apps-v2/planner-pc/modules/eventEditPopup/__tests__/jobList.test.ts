import snapshotDiff from 'snapshot-diff';

import {
  ADD_JOB_LIST_EVENT_EDIT_POPUP,
  CLEAR_EVENT_EDIT_POPUP,
  FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP,
} from '../../../actions/eventEditPopup';

import reducer, {
  AddJobListEventEditPopupAction,
  FetchSuccessActiveJobListEventEditPopupAction,
  initialState,
} from '../jobList';
import { job, jobList } from './jobList.payloads';

describe('reducer()', () => {
  test('@@INIT', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = [
      {
        type: FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP,
        payload: jobList,
      } as FetchSuccessActiveJobListEventEditPopupAction,
    ].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ADD_JOB_LIST_EVENT_EDIT_POPUP, () => {
    // Arrange
    const prev = [
      {
        type: FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP,
        payload: jobList,
      } as FetchSuccessActiveJobListEventEditPopupAction,
    ].reduce(reducer, initialState);

    // Run
    const next = [
      {
        type: ADD_JOB_LIST_EVENT_EDIT_POPUP,
        payload: job,
      } as AddJobListEventEditPopupAction,
    ].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(CLEAR_EVENT_EDIT_POPUP, () => {
    // Arrange
    const prev = [
      {
        type: FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP,
        payload: jobList,
      } as FetchSuccessActiveJobListEventEditPopupAction,
      {
        type: ADD_JOB_LIST_EVENT_EDIT_POPUP,
        payload: job,
      } as AddJobListEventEditPopupAction,
    ].reduce(reducer, initialState);

    // Run
    const next = [{ type: CLEAR_EVENT_EDIT_POPUP }].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
