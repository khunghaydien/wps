import snapshotDiff from 'snapshot-diff';

// @ts-ignore
import reducer, { __get__, actions } from '../editingFixSummaryRequest';
import fixSummaryRequest from './mocks/fixSummaryRequest';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff(undefined, next)).toMatchSnapshot();
  });
  test(ACTIONS.SET, () => {
    // Arrange
    const prev = {};
    // Act
    const next = reducer(initialState, actions.set(fixSummaryRequest));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.UNSET, () => {
    // Arrange
    const prev = fixSummaryRequest;
    // Act
    const next = reducer(fixSummaryRequest, actions.unset());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.UPDATE, () => {
    // Arrange
    const prev = fixSummaryRequest;
    // Act
    const next = reducer(
      fixSummaryRequest,
      actions.update('comment', '勤務確定申請します。')
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
