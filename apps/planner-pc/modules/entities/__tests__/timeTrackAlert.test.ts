import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  FETCH_SUCCESS,
  initialState,
} from '../timeTrackAlert';

describe('reducer()', () => {
  test('@@INIT', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(FETCH_SUCCESS, () => {
    // Arrange
    const prev = initialState;

    // Act
    const next = [
      actions.fetchSuccess({
        '2019-10-01': [
          {
            level: 'Warn',
            code: 'TIME_ATT_CONSISTENCY',
          },
        ],
        '2019-10-02': [
          {
            level: 'Warn',
            code: 'TIME_ATT_CONSISTENCY',
          },
        ],
        '2019-10-03': [
          {
            level: 'Warn',
            code: 'TIME_ATT_CONSISTENCY',
          },
        ],
      }),
    ].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
