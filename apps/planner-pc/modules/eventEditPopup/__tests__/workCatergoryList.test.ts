import snapshotDiff from 'snapshot-diff';

import {
  CLEAR_EVENT_EDIT_POPUP,
  CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP,
  FETCH_SUCCESS_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP,
} from '../../../actions/eventEditPopup';

import {
  ClearEventEditPopupAction,
  ClearWorkCategoryListEventEditPopupAction,
} from '../event';
import reducer, {
  FetchSuccessWorkCategoryListEventEditPopupAction,
  initialState,
} from '../workCategoryList';
import { workCategoryList } from './workCategoryList.payloads';

describe('reducer()', () => {
  test('@@INIT', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff([], next)).toMatchSnapshot();
  });
  test(CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP, () => {
    // Arrange
    const prev = [
      {
        type: FETCH_SUCCESS_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP,
        payload: workCategoryList,
      } as FetchSuccessWorkCategoryListEventEditPopupAction,
    ].reduce(reducer, initialState);

    // Act
    const next = [
      {
        type: CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP,
      } as ClearWorkCategoryListEventEditPopupAction,
    ].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff([], next)).toMatchSnapshot();
  });
  test(FETCH_SUCCESS_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP, () => {
    // Arrange
    const prev = initialState;

    // Act
    const next = [
      {
        type: FETCH_SUCCESS_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP,
        payload: workCategoryList,
      } as FetchSuccessWorkCategoryListEventEditPopupAction,
    ].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(CLEAR_EVENT_EDIT_POPUP, () => {
    // Arrange
    const prev = initialState;

    // Act
    const next = [
      {
        type: CLEAR_EVENT_EDIT_POPUP,
      } as ClearEventEditPopupAction,
    ].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
