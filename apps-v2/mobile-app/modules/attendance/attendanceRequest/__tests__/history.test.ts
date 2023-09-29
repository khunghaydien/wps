import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../history';

const ACTION_TYPES = __get__('ACTION_TYPES');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.INITIALIZE, () => {
    // Arrange
    const prev = initialState;
    const histories = [];
    for (let i = 0; i < 3; i++) {
      histories.push({
        id: '000' + i,
        stepName: 'Step Name' + i,
        approveTime: 'Approve Time' + i,
        status: 'Status',
        statusLabel: 'Status Label' + i,
        approverName: 'Approver Name' + i,
        actorName: 'Actor Name' + i,
        actorPhotoUrl: 'Actor Photo URL' + i,
        comment: 'Comment' + i,
        isDelegated: false,
      });
    }
    // Act
    const next = reducer(prev, actions.initialize(histories));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.CLEAR, () => {
    // Arrange
    const prev = [];
    for (let i = 0; i < 3; i++) {
      prev.push({
        id: '000' + i,
        stepName: 'Step Name' + i,
        approveTime: 'Approve Time' + i,
        status: 'Status',
        statusLabel: 'Status Label' + i,
        approverName: 'Approver Name' + i,
        actorName: 'Actor Name' + i,
        actorPhotoUrl: 'Actor Photo URL' + i,
        comment: 'Comment' + i,
        isDelegated: false,
      });
    }
    // Act
    const next = reducer(prev, actions.clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
