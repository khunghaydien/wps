import { bindActionCreators, Dispatch } from 'redux';

import format from 'date-fns/format';
import debounce from 'lodash/debounce';

import { TIME_TRACK_SUBMIT } from '@commons/constants/customEventName';
import {
  KEY_IN_CUSTOM_EVENT_DETAIL as SOURCE,
  TimeTrackCustomEventSource,
} from '@commons/constants/customEventSource';

import msg from '@commons/languages';
import { actions as appActions } from '@commons/modules/app';
import { fetchSuccess as fetchPersonalSettingSuccess } from '@commons/modules/personalSetting';
import { showToast } from '@commons/modules/toast';
import DateUtil from '@commons/utils/DateUtil';
import dispatchEvent from '@commons/utils/EventUtil';

import PersonalSettingRepository from '../../../repositories/PersonalSettingRepository';
import RequestRepository from '../../../repositories/time-tracking/RequestRepository';
import SummaryRepository from '../../../repositories/time-tracking/SummaryRepository';
import TrackSummarySettingRepository from '../../../repositories/time-tracking/TrackSummarySettingRepository';

import { getRequestApprovalHistory } from '../../../domain/models/approval/request/History';
import STATUS, { Status } from '../../../domain/models/approval/request/Status';

import { actions as historyListActions } from '../../../../widgets/dialogs/ApprovalHistoryDialog/modules/entities/historyList';
import { actions as requestActions } from '../modules/entities/request';
import { actions as alertActions } from '../modules/entities/requestAlert';
import { actions as summaryActions } from '../modules/entities/summary';
import { actions } from '../modules/ui/request';

import TransferAppActions from '@apps/time-tracking/time-tracking-charge-transfer-pc/action-dispatchers/App';

import AppActions from './App';

const App = (dispatch: Dispatch) => ({
  ...bindActionCreators({ ...appActions, showToast }, dispatch),
  ...AppActions(dispatch),
});

const PersonalSetting = (dispatch: Dispatch) => ({
  load: async (): Promise<void> =>
    PersonalSettingRepository.fetch().then((result) => {
      dispatch(fetchPersonalSettingSuccess(result));
    }),
});

const Summary = (dispatch: Dispatch, empId?: string) => ({
  load: async (targetDate: string): Promise<void> => {
    dispatch(summaryActions.setTargetDate(targetDate));
    const summary = await SummaryRepository.fetchSummary({
      targetDate,
      empId,
    });
    dispatch(summaryActions.fetchSuccess(summary, targetDate));
    dispatch(requestActions.update(targetDate));
  },

  updateIsOpenByDefault: debounce(
    TrackSummarySettingRepository.updateIsOpenByDefault,
    1000
  ),
});

const UI = (dispatch: Dispatch) => ({
  editComment: (value: string) => {
    dispatch(actions.update({ comment: value }));
  },

  closeRequestDialog: () => {
    dispatch(actions.reset());
  },

  openRequestDialog: () => {
    dispatch(actions.update({ isOpen: true }));
  },
});

const Request = (dispatch: Dispatch, empId?: string) => ({
  fetchAlert: async (targetDate: string) => {
    const requestAlert = await RequestRepository.fetchAlert({
      targetDate,
      empId: empId === '' ? undefined : empId,
    });
    dispatch(alertActions.fetchSuccess(requestAlert));
  },
  submit: async (comment: string, targetDate: string) => {
    await RequestRepository.submit({
      comment,
      targetDate,
      empId: empId === '' ? undefined : empId,
    });
  },

  recall: async (requestId: string, comment: string) => {
    await RequestRepository.recall({
      requestId,
      comment,
      empId: empId === '' ? undefined : empId,
    });
  },

  cancel: async (requestId: string, comment: string) => {
    await RequestRepository.cancel({
      requestId,
      comment,
      empId: empId === '' ? undefined : empId,
    });
  },
});

export type Options = {
  parentAppActions?: ReturnType<typeof TransferAppActions>;
  source?: TimeTrackCustomEventSource;
};

export default (dispatch: Dispatch, empId?: string, options?: Options) => {
  const today = DateUtil.getToday();
  const summary = Summary(dispatch, empId);
  const request = Request(dispatch, empId);
  const ui = UI(dispatch);
  const app = App(dispatch);
  const personalSetting = PersonalSetting(dispatch);

  // Use cases of time track report request
  //
  // NOTE
  // Consider whether to separate objects for each actor
  // e.g.
  // const Application = (dispatch) => ({
  //   initialize: () => {...},
  // )};
  //
  // Application.initialize();
  //
  //
  // const Employee = (dispatch) => ({
  //   seeTimeTrackSummaryOfNextPeriod: () => {...},
  //   applyForTimeTrackReport: () => {...}
  // });
  //
  // Employee.seeTimeTrackSummaryOfNextPeriod();
  // Employee.applyForTimeTrackReport();
  //
  return {
    /**
     * Application "initialize"s its first view.
     */
    initialize: async (targetDate: string = today): Promise<void> => {
      try {
        app.loadingStart();

        await Promise.all([
          // NOTE:
          // This does not need to be ran for every initialization process (period transition).
          // But since PersonalSetting and Summary share the same load expression, it is placed here.
          personalSetting.load(),

          /**
           * Handle empty string as today
           */
          summary.load(targetDate === '' ? today : targetDate),
        ]);
      } catch (e) {
        if (options?.parentAppActions && e.errorCode === 'RECORD_NOT_FOUND') {
          options.parentAppActions.catchApiError(e, { isContinuable: false });
        } else {
          app.showErrorNotification(e);
        }
      } finally {
        app.loadingEnd();
      }
    },

    /**
     *  Application loads time track summary of next period by Employee operation
     */
    loadNextPeriodSummary: async (currentPeriod: {
      endDate: string;
    }): Promise<void> => {
      try {
        app.loadingStart();

        const nextDate = DateUtil.addDays(currentPeriod.endDate, 1);
        await summary.load(nextDate);
      } catch (e) {
        app.showErrorNotification(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     *  Application loads time track summary of previous period by Employee operation
     */
    loadPrevPeriodSummary: async (currentPeriod: {
      startDate: string;
    }): Promise<void> => {
      try {
        app.loadingStart();

        const prevDate = DateUtil.addDays(currentPeriod.startDate, -1);
        await summary.load(prevDate);
      } catch (e) {
        app.showErrorNotification(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     * Application loads time track summary of today by Employee operation
     */
    loadCurrentPeriodSummary: async () => {
      try {
        app.loadingStart();

        await summary.load(today);
      } catch (e) {
        app.showErrorNotification(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     * Employee edits their comment on request dialog
     */
    editComment: (value: string) => {
      ui.editComment(value);
    },

    /**
     * Employee closes request dialog
     */
    close: () => {
      ui.closeRequestDialog();
    },

    /**
     * Employee opens request dialog
     */
    open: () => {
      ui.openRequestDialog();
    },

    /**
     * Fetch whether an employee has submitted a time track report.
     */
    fetchAlert: async (targetDate: string) => {
      try {
        app.loadingStart();

        await request.fetchAlert(targetDate);
      } catch (e) {
        app.showErrorNotification(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     * Employee submits a time track report
     */
    submit: async (
      comment: string,
      targetDate: string,
      today: Date = new Date()
    ) => {
      try {
        app.loadingStart();
        ui.closeRequestDialog();

        await request.submit(comment, targetDate);
        await Promise.all([
          summary.load(targetDate),
          request.fetchAlert(format(today, 'YYYY-MM-DD')),
        ]);

        dispatchEvent(TIME_TRACK_SUBMIT, {
          detail: { [SOURCE]: options?.source },
        });

        app.showToast(msg().Time_Lbl_SubmitSucceeded);
      } catch (e) {
        app.showErrorNotification(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     * Employee recalls a submitted time track report
     */
    recall: async (
      requestId: string,
      comment: string,
      targetDate: string,
      today: Date = new Date()
    ) => {
      try {
        app.loadingStart();
        ui.closeRequestDialog();

        await request.recall(requestId, comment);
        await Promise.all([
          summary.load(targetDate),
          request.fetchAlert(format(today, 'YYYY-MM-DD')),
        ]);

        dispatchEvent(TIME_TRACK_SUBMIT, {
          detail: { [SOURCE]: options?.source },
        });

        app.showToast(msg().Time_Lbl_RecallSucceeded);
      } catch (e) {
        app.showErrorNotification(e);
      } finally {
        app.loadingEnd();
      }
    },

    /**
     * Employee cancels an approved time track report
     */
    cancelApproval: async (
      requestId: string,
      comment: string,
      targetDate: string,
      today: Date = new Date()
    ) => {
      try {
        app.loadingStart();
        ui.closeRequestDialog();

        // NOTE
        // `recall` performs also `cancel approval` action internally.
        // In the future, an additional API for `cancel approval` will be added
        // most possibly.
        await request.cancel(requestId, comment);
        await Promise.all([
          summary.load(targetDate),
          request.fetchAlert(format(today, 'YYYY-MM-DD')),
        ]);

        dispatchEvent(TIME_TRACK_SUBMIT, {
          detail: { [SOURCE]: options?.source },
        });

        app.showToast(msg().Time_Lbl_CancelApprovalSucceeded);
      } catch (e) {
        app.showErrorNotification(e);
      } finally {
        app.loadingEnd();
      }
    },

    openHistoryDialog: async (requestId: string): Promise<void> => {
      dispatch(historyListActions.unset());

      try {
        app.loadingStart();

        const res = await getRequestApprovalHistory(requestId);
        dispatch(historyListActions.set(res.historyList));
        dispatch(actions.update({ isOpenHistoryDialog: true }));
      } catch (e) {
        app.showErrorNotification(e);
      } finally {
        app.loadingEnd();
      }
    },

    updateIsOpenByDefault: async (isOpen: boolean) => {
      try {
        await summary.updateIsOpenByDefault(isOpen);
      } catch (e) {
        app.showErrorNotification(e);
      }
    },

    /**
     * Employee applies for a time track report according to the application status
     */
    get applyForTimeTrackReport() {
      type Props = {
        status: Status;
        requestId: string | null | undefined;
        comment: string;
        targetDate: string;
      };

      return ({ status, requestId, comment, targetDate }: Props) => {
        const unexpectedStatus = () =>
          app.showErrorNotification(new Error(`Unexpected status: ${status}`));
        const action = {
          [STATUS.NotRequested]: () => this.submit(comment, targetDate),
          [STATUS.Rejected]: () => this.submit(comment, targetDate),
          [STATUS.Canceled]: () => this.submit(comment, targetDate),
          [STATUS.Recalled]: () => this.submit(comment, targetDate),
          [STATUS.Pending]: () => this.recall(requestId, comment, targetDate),
          [STATUS.Approved]: () =>
            this.cancelApproval(requestId, comment, targetDate),
          [STATUS.Reapplying]: unexpectedStatus,
          [STATUS.ApprovalIn]: unexpectedStatus,
          [STATUS.ApprovedPreRequest]: unexpectedStatus,
        }[status];

        return action();
      };
    },
  };
};
