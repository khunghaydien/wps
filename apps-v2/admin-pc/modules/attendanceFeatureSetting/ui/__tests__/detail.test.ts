import snapshotDiff from 'snapshot-diff';

import { AttOpsRecordAggregateSetting } from '@apps/admin-pc/models/attendance/AttOpsRecordAggregateSetting';

import reducer, { ACTION_TYPE, actions, initialState, State } from '../detail';

describe('reducer()', () => {
  test('@@INIT', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.INIT, () => {
    const prev: State = {
      selectedIndex: 0,
      selectedHistoryId: 'xxx',
      OpsRecordAggregate: [
        { label: 'xxx', fieldName: 'xxx', aggregateType: 'xxx' },
      ],
      TempOpsRecordAggregate: [
        { label: 'xxx', fieldName: 'xxx', aggregateType: 'xxx' },
      ],
    };
    const next = reducer(prev, actions.initialize());
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET_HISTORY_ID, () => {
    const prev = initialState;

    const next = reducer(prev, actions.setSelectedHistoryId('xxxxx'));

    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET_OPS_RECORD, () => {
    const prev = initialState;

    const next = reducer(
      prev,
      actions.setTempOpsRecordAggregate([
        {
          label: 'xxx',
          fieldName: 'xxx',
          aggregateType: 'xxx',
        },
      ])
    );

    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.UPDATE_OPS_RECORD, () => {
    const prev = initialState;
    const key = Object.keys({
      label: 'xxx',
      fieldName: 'xxx',
      aggregateType: 'xxx',
    }) as unknown as keyof AttOpsRecordAggregateSetting;

    const next = reducer(prev, actions.updateOpsRecordAggregate(0, key, 'xxx'));

    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
