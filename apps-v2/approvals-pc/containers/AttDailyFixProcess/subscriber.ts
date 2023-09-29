import { Store } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import FixDailyRequestRepository from '@attendance/repositories/approval/FixDailyRequestRepository';

import { State } from '@apps/approvals-pc/modules';
import { actions as activeDialogActions } from '@apps/approvals-pc/modules/ui/activeDialog';
import { actions as checkedIdsActions } from '@apps/approvals-pc/modules/ui/attFixDaily/checked';
import { ACTION_TYPE as PROCESS_ACTIONS } from '@apps/approvals-pc/modules/ui/attFixDaily/process';
import { actions as recordActions } from '@apps/approvals-pc/modules/ui/attFixDaily/records';
import { actions as selectedIdsActions } from '@apps/approvals-pc/modules/ui/attFixDaily/selectedId';

import LocalEvents from './events';

const loadRecords = (store: Store) => async () => {
  const dispatch = store.dispatch;
  const state = store.getState() as State;
  const approvalType = state.ui.approvalType;

  dispatch(loadingStart());
  try {
    const result = await FixDailyRequestRepository.fetchList({ approvalType });
    dispatch(recordActions.initialize(result));
  } catch (err) {
    dispatch(catchApiError(err));
  } finally {
    dispatch(loadingEnd());
  }
};

const initialize = (store: Store) => async () => {
  const dispatch = store.dispatch;
  dispatch(selectedIdsActions.clear());
  await loadRecords(store)();
};

const finalize = (store: Store) => async () => {
  store.dispatch(selectedIdsActions.clear());
  store.dispatch(recordActions.initialize([]));
};

const closeDetailPanel = (store: Store) => (id: string | void) => {
  const dispatch = store.dispatch;
  const state = store.getState() as State;
  if (id) {
    const selectedId = state.ui.attFixDaily.selectedId;
    const $checkedIds = state.ui.attFixDaily.checked.ids;
    const checkedIds = $checkedIds.filter(($id) => id !== $id);
    dispatch(checkedIdsActions.set(checkedIds));
    if (id === selectedId) {
      dispatch(selectedIdsActions.clear());
    }
  } else {
    dispatch(checkedIdsActions.clear());
    dispatch(
      recordActions.filter({
        employee: [],
        department: [],
        targetDate: '',
        requestAndEvent: [],
      })
    );
    dispatch(selectedIdsActions.clear());
    dispatch(activeDialogActions.hide());
  }
  dispatch({ type: PROCESS_ACTIONS.SUCCESS });
  loadRecords(store)();
};

export default (store: Store): (() => void) => {
  const unsubscribers: (() => void)[] = [];
  unsubscribers.push(
    LocalEvents.switchedApprovalType.subscribe(initialize(store)),
    LocalEvents.approved.subscribe(closeDetailPanel(store)),
    LocalEvents.rejected.subscribe(closeDetailPanel(store))
  );

  initialize(store)();

  return () => {
    finalize(store)();
    unsubscribers.forEach((unsubscriber) => unsubscriber());
  };
};
