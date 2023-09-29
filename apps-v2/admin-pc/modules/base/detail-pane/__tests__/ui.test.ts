import snapshotDiff from 'snapshot-diff';

import reducer, {
  INITIALIZE,
  initializeDetailPane,
  initialState,
  MODE,
  SET_MODE_BASE,
  SET_MODE_HISTORY,
  setModeBase,
  setModeHistory,
  SHOW_DETAIL_PANE,
  SHOW_REVISION_DIALOG_PANE,
  showDetailPane,
  showRevisionDialog,
} from '../ui';

describe('reducer()', () => {
  it('@@init', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(INITIALIZE, () => {
    const state = {
      isShowDetail: false,
      isShowRevisionDialog: false,
      modeBase: MODE.EDIT,
      modeHistory: MODE.EDIT,
    };
    const next = reducer(state, initializeDetailPane());
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
  it(SHOW_DETAIL_PANE, () => {
    const next = reducer(initialState, showDetailPane(true));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(SHOW_REVISION_DIALOG_PANE, () => {
    const next = reducer(initialState, showRevisionDialog(true));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(SET_MODE_BASE, () => {
    const next = reducer(initialState, setModeBase(MODE.EDIT));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(SET_MODE_HISTORY, () => {
    const next = reducer(initialState, setModeHistory(MODE.REVISION));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
