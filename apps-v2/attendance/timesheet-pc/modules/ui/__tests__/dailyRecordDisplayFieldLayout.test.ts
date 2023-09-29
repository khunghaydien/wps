import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../dailyRecordDisplayFieldLayout';
import { formattedTable, table } from './mocks/fetchTable.mock';

const ACTION_TYPE = __get__('ACTION_TYPE');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.START_LOADING, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(prev, actions.startLoading());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.END_LOADING, () => {
    // Arrange
    const prev = { ...initialState, isLoading: true };
    // Act
    const next = reducer(prev, actions.endLoading());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(prev, actions.set(table));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.RESET, () => {
    // Arrange
    const prev = {
      ...formattedTable,
      isLoading: false,
      layoutTempValues: formattedTable.layoutValues,
      catchError: false,
    };
    // Act
    const next = reducer(prev, actions.reset());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.UPDATE_FIELD, () => {
    // Arrange
    const prev = {
      ...formattedTable,
      isLoading: false,
      layoutTempValues: formattedTable.layoutValues,
      catchError: false,
    };
    // Act
    const next = reducer(
      prev,
      actions.updateField({
        date: '2020-02-01',
        key: '00015',
        value: 'テキスト1',
      })
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.CATCH_ERROR, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(prev, actions.catchError());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
