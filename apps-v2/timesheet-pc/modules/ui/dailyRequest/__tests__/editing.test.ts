import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../editing';
import dailyRequest from './mocks/dailyRequest';

const ACTION_TYPE = __get__('ACTION_TYPE');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.INITIALIZE, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, actions.initialize(dailyRequest, true));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.CLEAR, () => {
    // Arrange
    const prev = {
      id: 'a012v000033TVRXAA4',
      requestTypeCode: 'Leave',
      isEditing: true,
      editAction: 'Create',
      disableAction: '',
    };
    // Act
    const next = reducer(initialState, actions.clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
