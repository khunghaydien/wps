import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  COMMENT_CLEAR,
  COMMENT_EDIT,
  initialState,
} from '../comment';

describe('reducer()', () => {
  describe('@init', () => {
    it('@@init', () => {
      // @ts-ignore
      const next = reducer(undefined, { type: '@@INIT' });
      expect(snapshotDiff({}, next)).toMatchSnapshot();
    });
  });
  describe(`${COMMENT_EDIT}`, () => {
    it('COMMENT_EDIT', () => {
      const next = reducer(initialState, actions.edit('testを行いました'));
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
  });
  describe(`${COMMENT_CLEAR}`, () => {
    it('COMMENT_CLEAR', () => {
      const state = {
        message: 'test前。このメッセージが空になっていたらテスト成功',
      };
      const next = reducer(initialState, actions.clear());
      expect(snapshotDiff(state, next)).toMatchSnapshot();
    });
  });
});
