import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import snapshotDiff from 'snapshot-diff';

import * as detailActions from '../detail';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin-pc/action-dispatchers/working-type/detail.ts', () => {
  test('startEditingBase()', () => {
    // Arrange
    const store = mockStore();
    const editRecord = {
      companyId: '123',
      id: 'abc',
    };
    const editRecordHistory = {
      id: 'def',
      baseId: 'abc',
      validDateFrom: '2020-01-01',
      comment: '改定理由のテスト',
    };
    const dispatch = store.dispatch as any;

    // Run
    dispatch(
      detailActions.startCloneEditingBase(editRecord, editRecordHistory)
    );
    const actions = store.getActions();

    // Assert
    expect(snapshotDiff([], actions)).toMatchSnapshot();
  });
});
