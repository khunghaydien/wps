import snapshotDiff from 'snapshot-diff';

import reducer, { actions, FETCH, initialState } from '../list';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(FETCH, () => {
    const next = reducer(
      initialState,
      actions.fetch([
        {
          id: 'ID',
          historyId: 'History ID',
          code: 'Code',
          name: 'Name',
          departmentName: 'Department Name',
          managerName: 'Manager Name',
          title: 'Title',
          photoUrl: 'Photo URL',
          workingTypeName: 'WorkingTypeName',
        },
      ])
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
