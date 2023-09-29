import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  CLOSE_MODAL,
  initialState,
  SHOW_MODAL,
} from '../modal';

describe('reducer()', () => {
  describe('@init', () => {
    it('@@init', () => {
      // @ts-ignore
      const next = reducer(undefined, { type: '@@INIT' });
      expect(snapshotDiff({}, next)).toMatchSnapshot();
    });
  });
  describe(`${SHOW_MODAL}`, () => {
    it('SHOW_MODAL', () => {
      const next = reducer(initialState, actions.showModal(45));
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
  });
  describe(`${CLOSE_MODAL}`, () => {
    it('CLOSE_MODAL', () => {
      const state = { insufficientRestTime: '45', isShowModal: true };
      const next = reducer(initialState, actions.closeModal());
      expect(snapshotDiff(state, next)).toMatchSnapshot();
    });
  });
});
