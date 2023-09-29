import snapshotDiff from 'snapshot-diff';

import { FixDailyRequest as DomainFixDailyRequest } from '@attendance/domain/models/approval/FixDailyRequest';

import reducer, {
  // @ts-ignore
  __get__,
  // @ts-ignore
  __set__,
  actions,
  State,
} from '../request';

const ACTION_TYPE = __get__('ACTION_TYPE');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff(undefined, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(
      prev,
      actions.set({ record: 'record' } as unknown as DomainFixDailyRequest)
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.UNSET, () => {
    // Arrange
    const prev = { record: 'record' } as unknown as State;
    // Act
    const next = reducer(prev, actions.unset());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
