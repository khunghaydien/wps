import { bindActionCreators, Dispatch } from 'redux';

import isEqual from 'lodash/isEqual';

import { TIME_TRACK_UPDATED } from '@commons/constants/customEventName';

import msg from '../../commons/languages';
import { fetch as fetchPersonalSetting } from '../../commons/modules/personalSetting';
import DateUtil from '../../commons/utils/DateUtil';
import dispatchEvent from '../../commons/utils/EventUtil';
import { loadingEnd, loadingStart, withLoading } from '@commons/actions/app';

import DailySummaryRepository from '../../repositories/DailySummaryRepository';
import PlannerEventRepository from '../../repositories/PlannerEventRepository';
import DailyStampTimeRepository from '@attendance/repositories/DailyStampTimeRepository';

import { DailySummary } from '../../domain/models/time-management/DailySummary';
import {
  applyAllocateResultToTaskList,
  containsTaskNoteThatCannotBeSaved,
  DailySummaryTask,
  isPercentageFull,
} from '../../domain/models/time-management/DailySummaryTask';
import { AutoHoursAllocationDictSurplusTime } from '../../domain/models/time-tracking/AutoHoursAllocationDict';
import { AutoHoursAllocationResult } from '../../domain/models/time-tracking/AutoHoursAllocationResult';
import { Job } from '../../domain/models/time-tracking/Job';
import { User } from '../../domain/models/User';
import * as DailyStampTime from '@attendance/domain/models/DailyStampTime';

import { actions as EventsActions } from '../modules/entities/events';
import { actions as JobsActions } from '../modules/entities/jobs';
import { actions as DailySummaryActions } from '../modules/ui/dailySummary';

import { CloseEventHandler } from '../events';
import DailySummaryApp from './App';
import { AppDispatch } from './AppThunk';
import WorkCategoryList from './WorkCategoryList';

export const closeDailySummary = () => async (dispatch: Dispatch) => {
  const EventsService = bindActionCreators(EventsActions, dispatch);
  const DailySummaryService = bindActionCreators(DailySummaryActions, dispatch);
  const WorkCategoryListService = WorkCategoryList(dispatch);
  DailySummaryService.reset();
  EventsService.reset();
  WorkCategoryListService.clear();
};

export const openDailySummary =
  (targetDate: string, empId?: string) => async (dispatch: Dispatch) => {
    const EventsService = bindActionCreators(EventsActions, dispatch);
    const DailySummaryService = bindActionCreators(
      DailySummaryActions,
      dispatch
    );
    const AppService = bindActionCreators(
      { loadingStart, loadingEnd },
      dispatch
    );
    const dailySummaryApp = DailySummaryApp(dispatch);

    AppService.loadingStart();
    try {
      // @ts-ignore
      dispatch(fetchPersonalSetting());
      DailySummaryService.reset();
      EventsService.reset();

      DailySummaryService.update('targetDate', targetDate);
      EventsService.setTargetDate(targetDate);

      const [dailySummary, { events }] = await Promise.all([
        DailySummaryRepository.fetch({ targetDate, empId }),
        PlannerEventRepository.fetch({
          startDate: targetDate,
          endDate: targetDate,
          empId,
        }),
      ]);
      DailySummaryService.fetchSuccess(dailySummary, targetDate);
      EventsService.fetchSuccess(events, targetDate);

      if (DateUtil.isToday(targetDate)) {
        const stampTime = await DailyStampTimeRepository.fetch();
        DailySummaryService.setIsEnableEndStamp(
          stampTime.isEnableEndStamp,
          targetDate
        );
      } else {
        DailySummaryService.update('isEnableEndStamp', false);
      }
    } catch (e) {
      dailySummaryApp.showErrorNotification(e);
    } finally {
      AppService.loadingEnd();
    }
  };

export const editNote = (value: string) => (dispatch: Dispatch) => {
  dispatch(DailySummaryActions.update('note', value));
};

export const editTimestampComment = (value: string) => (dispatch: Dispatch) => {
  dispatch(DailySummaryActions.update('timestampComment', value));
};

export const saveDailySummary =
  (dailySummary: DailySummary, onClose: CloseEventHandler, user?: User) =>
  async (dispatch: Dispatch) => {
    const AppService = bindActionCreators(
      { loadingStart, loadingEnd },
      dispatch
    );
    const dailySummaryApp = DailySummaryApp(dispatch);
    const DailySummaryService = bindActionCreators(
      DailySummaryActions,
      dispatch
    );

    AppService.loadingStart();
    try {
      const containsNonDirectInputTask = dailySummary.taskList.some(
        (task) => !task.isDirectInput
      );

      if (
        containsNonDirectInputTask &&
        !isPercentageFull(dailySummary.taskList)
      ) {
        throw new Error(msg().Trac_Err_CannotSaveJob);
      }

      if (dailySummary.taskList.some(containsTaskNoteThatCannotBeSaved)) {
        const yes = await dailySummaryApp.confirm(
          msg().Trac_Msg_ContainsTaskNoteThatCannotBeSaved
        );
        if (!yes) {
          return;
        }
      }

      // @ts-ignore This function has a single argument
      await DailySummaryRepository.update(
        dailySummary,
        // @ts-ignore unnecessary params
        user?.isDelegated ? user?.id : undefined
      );

      DailySummaryService.saveSuccess();
      dispatchEvent(TIME_TRACK_UPDATED);

      onClose({
        dismissed: false,
        saved: true,
        timestamp: false,
        targetDate: dailySummary.targetDate,
      });
    } catch (e) {
      dailySummaryApp.showErrorNotification(e);
    } finally {
      AppService.loadingEnd();
    }
  };

export const saveDailySummaryAndLeaveWork =
  (
    dailySummary: DailySummary,
    comment: string,
    plannerDefaultView: 'Weekly' | 'Daily',
    onClose: CloseEventHandler,
    user?: User
  ) =>
  async (dispatch: AppDispatch) => {
    const AppService = bindActionCreators(
      { loadingStart, loadingEnd },
      dispatch
    );
    const dailySummaryApp = DailySummaryApp(dispatch);
    const DailySummaryService = bindActionCreators(
      DailySummaryActions,
      dispatch
    );

    AppService.loadingStart();
    try {
      const containsNonDirectInputTask = dailySummary.taskList.some(
        (task) => !task.isDirectInput
      );

      if (
        containsNonDirectInputTask &&
        !isPercentageFull(dailySummary.taskList)
      ) {
        throw new Error(msg().Trac_Err_CannotSaveJob);
      }

      if (dailySummary.taskList.some(containsTaskNoteThatCannotBeSaved)) {
        const yes = await dailySummaryApp.confirm(
          msg().Trac_Msg_ContainsTaskNoteThatCannotBeSaved
        );
        if (!yes) {
          return;
        }
      }

      await DailySummaryRepository.update(
        dailySummary,
        // @ts-ignore unnecessary params
        user?.isDelegated ? user?.id : undefined
      );

      const result = await DailyStampTimeRepository.post({
        clockType: DailyStampTime.CLOCK_TYPE.OUT,
        source: DailyStampTime.STAMP_SOURCE.WEB,
        comment,
      });

      DailySummaryService.saveSuccess();
      dispatchEvent(TIME_TRACK_UPDATED);

      const shouldBeDismissed = plannerDefaultView !== 'Daily';
      onClose({
        dismissed: shouldBeDismissed,
        saved: true,
        timestamp: true,
        targetDate: dailySummary.targetDate,
        dailyStampTimeResult: result,
      });

      if (!shouldBeDismissed) {
        dispatch(openDailySummary(dailySummary.targetDate));
      } else {
        dispatch(closeDailySummary());
      }
    } catch (e) {
      dailySummaryApp.showErrorNotification(e);
    } finally {
      AppService.loadingEnd();
    }
  };

export const editTask =
  (index: number, prop: string, value: unknown) => (dispatch: Dispatch) => {
    dispatch(DailySummaryActions.updateTask(index, prop, value));
  };

export const deleteTask = (index: number) => (dispatch: Dispatch) => {
  dispatch(DailySummaryActions.deleteTask(index));
};

export const toggleTask = (index: number) => (dispatch: Dispatch) => {
  dispatch(DailySummaryActions.toggleDirectInput(index));
};

export const reorderTask =
  (reorderedTasks: DailySummaryTask[]) => (dispatch: Dispatch) => {
    dispatch(DailySummaryActions.update('taskList', reorderedTasks));
  };

export const openJobSelectDialog = () => async (dispatch: Dispatch) => {
  dispatch(JobsActions.clear());
  dispatch(DailySummaryActions.openJobSelectDialog());
};

export const closeJobSelectDialog = () => (dispatch: Dispatch) => {
  dispatch(JobsActions.clear());
  dispatch(DailySummaryActions.closeJobSelectDialog());
};

export const addJobToTaskList =
  (targetDate: string, selectedItem: Job) => async (dispatch: AppDispatch) => {
    const dailySummaryApp = DailySummaryApp(dispatch);
    const AppService = bindActionCreators({ withLoading }, dispatch);

    try {
      // TODO: remove unnecessary loading
      await AppService.withLoading(async () => {
        dispatch(DailySummaryActions.addJobToTaskList(selectedItem));
      });
    } catch (e) {
      dailySummaryApp.showErrorNotification(e);
    }

    dispatch(JobsActions.clear());
    dispatch(closeJobSelectDialog());
  };

export const checkBeforeOpenAutoHoursAllocationResultDialog =
  (editingTaskList: DailySummaryTask[], originalTaskList: DailySummaryTask[]) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    const dailySummaryApp = DailySummaryApp(dispatch);

    // デイリーサマリー表示後に、何らかの変更がある場合は、
    // 編集内容が破棄されることを案内して確認を求める
    //
    // NOTE: Apr'22では、実装の速さを優先してlodash/isEqualで大雑把な判定をしている
    //       変更とみなす項目を絞るなど、いずれ条件を精緻にしても良い
    if (!isEqual(editingTaskList, originalTaskList)) {
      return dailySummaryApp.confirm(
        msg().Time_Msg_ConfirmDiscardOfEditedContentsBeforeAllocation
      );
    }

    return Promise.resolve(true);
  };

export const applyAllocatedResult =
  (
    originalTaskList: DailySummaryTask[],
    allocatedResult: AutoHoursAllocationResult[],
    surplusTimeRegistrationSetting: AutoHoursAllocationDictSurplusTime,
    timeOfAttendance: number | null | undefined
  ) =>
  (dispatch: AppDispatch) => {
    const updatedTaskList = applyAllocateResultToTaskList(
      originalTaskList,
      allocatedResult,
      surplusTimeRegistrationSetting,
      timeOfAttendance
    );

    // 結果をstateに反映する
    dispatch(DailySummaryActions.replaceTaskList(updatedTaskList));
  };
