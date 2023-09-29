import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  FETCH,
  INITIALIZE,
  initialState,
} from '../baseRecord';

const dummy = {
  id: 'id',
  code: 'code',
  name: 'name',
  userId: 'userId',
  userName: 'userName',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  lastName_L0: 'lastName_L0',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  lastName_L1: 'lastName_L1',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  lastName_L2: 'lastName_L2',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  firstName_L0: 'firstName_L0',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  firstName_L1: 'firstName_L1',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  firstName_L2: 'firstName_L2',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  middleName_L0: 'middleName_L0',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  middleName_L1: 'middleName_L1',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  middleName_L2: 'middleName_L2',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  displayName_L0: 'displayName_L0',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  displayName_L1: 'displayName_L1',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  displayName_L2: 'displayName_L2',
};

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore:w

    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(INITIALIZE, () => {
    // @ts-ignore
    const next = reducer(dummy, actions.initialize());
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(FETCH, () => {
    // @ts-ignore
    const next = reducer(initialState, actions.fetch(dummy));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
