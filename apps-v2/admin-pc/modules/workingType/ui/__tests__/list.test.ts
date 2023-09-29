import snapshotDiff from 'snapshot-diff';

import { ORDER_TYPE } from '@apps/repositories/organization/workingType/WorkingTypeRepository';

import reducer, { ACTION_TYPE, actions, initialState } from '../list';

const data = {
  selectedCode: '123',
  total: 1000,
  offsetCodes: ['001', '002', '003'],
  hasMoreRecords: false,
  sortOrder: {
    field: 'code',
    order: ORDER_TYPE.DESC,
  },
};

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET_SELECTED_CODE, () => {
    const next = reducer(initialState, actions.setSelectedCode('1234abc'));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.RESET_SELECTED_CODE, () => {
    const next = reducer(data, actions.resetSelectedCode());
    expect(snapshotDiff(data, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET_SORT_ORDER, () => {
    const next = reducer(
      initialState,
      actions.setSortOrder({
        field: 'code',
        order: ORDER_TYPE.ASC,
      })
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.RESET_SORT_ORDER, () => {
    const next = reducer(data, actions.resetSortOrder());
    expect(snapshotDiff(data, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET_OFFSET_CODES, () => {
    const next = reducer(
      initialState,
      actions.setOffsetCodes(1000, ['001', '002', '003'], false)
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.RESET_OFFSET_CODES, () => {
    const next = reducer(data, actions.resetOffsetCodes());
    expect(snapshotDiff(data, next)).toMatchSnapshot();
  });
});
