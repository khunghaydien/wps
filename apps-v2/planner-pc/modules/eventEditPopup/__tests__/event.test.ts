import snapshotDiff from 'snapshot-diff';

import {
  CLEAR_EVENT_EDIT_POPUP,
  CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP,
  EDIT_EVENT_EDIT_POPUP,
  SELECT_DATA_EVENT_EDIT_POPUP,
  SELECT_JOB_EVENT_EDIT_POPUP,
} from '../../../actions/eventEditPopup';

import reducer, {
  EditEventEditPopupAction,
  initialState,
  SelectDataEventEditPopupAction,
  SelectJobEventEditPopupAction,
} from '../event';
import { event, job } from './event.payloads';

describe('reducer()', () => {
  test('@@INIT', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(SELECT_DATA_EVENT_EDIT_POPUP, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = [
      {
        type: SELECT_DATA_EVENT_EDIT_POPUP,
        payload: event,
      } as SelectDataEventEditPopupAction,
    ].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  describe(`${EDIT_EVENT_EDIT_POPUP}`, () => {
    test.each([
      ['title', 'it should update title property'],
      ['start', '2019-01-01T15:00:00.000Z'],
      ['end', '2019-01-15T15:00:00.000Z'],
      ['location', 'it should update location property'],
      ['description', 'it should update description property'],
      ['isOuting', true],
    ])('%p', (prop, value) => {
      // Arrange
      const prev = [
        {
          type: SELECT_DATA_EVENT_EDIT_POPUP,
          payload: event,
        } as SelectDataEventEditPopupAction,
      ].reduce(reducer, initialState);

      // Run
      const next = [
        {
          type: EDIT_EVENT_EDIT_POPUP,
          payload: {
            key: prop,
            value,
          },
        } as EditEventEditPopupAction,
      ].reduce(reducer, prev);

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
  });
  test(SELECT_JOB_EVENT_EDIT_POPUP, () => {
    // Arrange
    const prev = [
      {
        type: SELECT_DATA_EVENT_EDIT_POPUP,
        payload: event,
      } as SelectDataEventEditPopupAction,
    ].reduce(reducer, initialState);

    // Run
    const next = [
      {
        type: SELECT_JOB_EVENT_EDIT_POPUP,
        payload: job,
      } as SelectJobEventEditPopupAction,
    ].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP, () => {
    // Arrange
    const prev = [
      {
        type: SELECT_DATA_EVENT_EDIT_POPUP,
        payload: event,
      } as SelectDataEventEditPopupAction,
      {
        type: SELECT_JOB_EVENT_EDIT_POPUP,
        payload: job,
      } as SelectJobEventEditPopupAction,
    ].reduce(reducer, initialState);

    // Run
    const next = [{ type: CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP }].reduce(
      reducer,
      prev
    );

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(CLEAR_EVENT_EDIT_POPUP, () => {
    // Arrange
    const prev = [
      {
        type: SELECT_DATA_EVENT_EDIT_POPUP,
        payload: event,
      } as SelectDataEventEditPopupAction,
      {
        type: SELECT_JOB_EVENT_EDIT_POPUP,
        payload: job,
      } as SelectJobEventEditPopupAction,
    ].reduce(reducer, initialState);

    // Run
    const next = [{ type: CLEAR_EVENT_EDIT_POPUP }].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
