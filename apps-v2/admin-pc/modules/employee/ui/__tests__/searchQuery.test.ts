import snapshotDiff from 'snapshot-diff';

import reducer, { actions, initialState, SAVE } from '../searchQuery';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(SAVE, () => {
    const next = reducer(
      initialState,
      actions.save({
        companyId: 'companyId',
        sortCondition: {
          field: 'code',
          order: 'ASC',
        },
        targetDate: '2019-10-01',
        code: '12345',
        name: 'Employee Name',
        managerName: 'Manager Name',
        workingTypeName: 'Working Type Name',
        departmentName: 'Department Name',
        title: 'Title',
        limitNumber: 100,
      })
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
