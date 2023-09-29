import snapshotDiff from 'snapshot-diff';

import { ORDER_TYPE } from '@apps/repositories/organization/attPattern/AttPatternListRepository';

import reducer, {
  ACTION_TYPE,
  actions,
  initialState,
} from '../../pattern/selectedTable';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.SET_SELECTED_PATTERN, () => {
    const next = reducer(
      initialState,
      actions.setSelectedPattern([
        {
          code: 'pattern01',
          name: 'pattern01',
          validDateFrom: '2023-03-20',
          validDateTo: '2100-03-20',
        },
      ])
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.ADD_SELECTED_PATTERN, () => {
    const state = {
      ...initialState,
      selectedTable: [
        {
          code: 'pattern01',
          name: 'pattern01',
          validDateFrom: '2023-03-20',
          validDateTo: '2100-03-20',
        },
      ],
    };
    const next = reducer(
      state,
      actions.addSelectedPattern({
        code: 'pattern02',
        name: 'pattern02',
        validDateFrom: '2023-03-20',
        validDateTo: '2100-03-20',
      })
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.DELETE_SELECTED_PATTERN, () => {
    const state = {
      ...initialState,
      selectedTable: [
        {
          code: 'pattern01',
          name: 'pattern01',
          validDateFrom: '2023-03-20',
          validDateTo: '2100-03-20',
        },
        {
          code: 'pattern02',
          name: 'pattern02',
          validDateFrom: '2023-03-20',
          validDateTo: '2100-03-20',
        },
      ],
    };
    const next = reducer(state, actions.deleteSelectedPattern('pattern01'));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.SET_SORT_ORDER, () => {
    const next = reducer(
      initialState,
      actions.setSortOrder({
        field: 'code',
        order: ORDER_TYPE.DESC,
      })
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.RESET, () => {
    const prev = {
      selectedTable: [
        {
          code: 'pattern01',
          name: 'pattern01',
          validDateFrom: '2023-03-20',
          validDateTo: '2100-03-20',
        },
        {
          code: 'pattern02',
          name: 'pattern02',
          validDateFrom: '2023-03-20',
          validDateTo: '2100-03-20',
        },
      ],
      sortOrder: {
        field: 'code',
        order: ORDER_TYPE.DESC,
      },
    };
    const next = reducer(prev, actions.reset());
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
