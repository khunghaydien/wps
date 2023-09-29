// Note: This test is for check out that psa moudles don't affect eventEditPopup

import snapshotDiff from 'snapshot-diff';

import psaEventPopupReducer, {
  ACTIONS,
  actions,
  initialState as psaEventPopupInitialState,
} from '../../../../psa-pc/sub-apps/event-popoup/modules/ui/conditions';

import reducer, { initialState } from '../eventEditPopup';

// Planner Sideyy
describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTIONS.SET, () => {
    const next = reducer(
      initialState,
      // @ts-ignore
      actions.set({
        isOpen: true,
        top: 215,
        left: 20,
      })
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(ACTIONS.CLOSE, () => {
    const openState = {
      isOpen: true,
      top: 215,
      left: 20,
    };
    // @ts-ignore
    const next = reducer(openState, actions.close());
    expect(snapshotDiff(openState, next)).toMatchSnapshot();
  });
});

// PSA side
describe('reducerPSA()', () => {
  test('@@init', () => {
    const next = psaEventPopupReducer(psaEventPopupInitialState, {
      type: '@@INIT',
    });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTIONS.SET, () => {
    const next = psaEventPopupReducer(
      psaEventPopupInitialState,
      actions.set({
        isOpen: true,
        top: 215,
        left: 20,
      })
    );
    expect(snapshotDiff(psaEventPopupInitialState, next)).toMatchSnapshot();
  });
  test(ACTIONS.CLOSE, () => {
    const openState = {
      isOpen: true,
      top: 215,
      left: 20,
    };
    const next = psaEventPopupReducer(openState, actions.close());
    expect(snapshotDiff(openState, next)).toMatchSnapshot();
  });
});
