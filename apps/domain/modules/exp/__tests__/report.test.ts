import snapshotDiff from 'snapshot-diff';

import reducer, { ACTIONS, actions, initialState } from '../report';
import { reportIdList } from './mocks/report';

describe('reducer()', () => {
  test('@@init', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTIONS.LIST_SUCCESS, () => {
    // Arrange
    const prev = initialState;

    // Action
    const next = reducer(prev, actions.list(reportIdList));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
