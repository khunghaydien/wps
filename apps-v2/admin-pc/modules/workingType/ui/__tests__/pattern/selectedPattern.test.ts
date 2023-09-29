import snapshotDiff from 'snapshot-diff';

import reducer, {
  ACTION_TYPE,
  actions,
  initialState,
} from '../../pattern/selectedPattern';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.INIT, () => {
    const next = reducer(
      initialState,
      actions.init([
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
  it(ACTION_TYPE.RESET, () => {
    const prev = {
      orginalSelectedPattern: [
        {
          code: 'pattern01',
          name: 'pattern01',
          validDateFrom: '2023-03-20',
          validDateTo: '2100-03-20',
        },
      ],
      selectedPattern: [
        {
          code: 'pattern01',
          name: 'pattern01',
          validDateFrom: '2023-03-20',
          validDateTo: '2100-03-20',
        },
      ],
    };
    const next = reducer(prev, actions.reset());
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
