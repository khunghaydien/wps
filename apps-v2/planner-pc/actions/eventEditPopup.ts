import { Dispatch } from 'redux';

import _ from 'lodash';
import moment from 'moment';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';
import DateUtil from '../../commons/utils/DateUtil';

import { Job } from '../../domain/models/time-tracking/Job';
import { CalendarEvent } from '../models/calendar-event/CalendarEvent';
import { WorkCategory } from '../models/tracking/WorkCategory';

import { State } from '../modules';
import {
  ClearEventEditPopupAction,
  ClearWorkCategoryListEventEditPopupAction,
  EditEventEditPopupAction,
  State as CalendarState,
} from '../modules/eventEditPopup/event';
import {
  AddJobListEventEditPopupAction,
  FetchSuccessActiveJobListEventEditPopupAction,
} from '../modules/eventEditPopup/jobList';
import { FetchSuccessWorkCategoryListEventEditPopupAction } from '../modules/eventEditPopup/workCategoryList';

import { AppAction, AppDispatch } from '../action-dispatchers/AppThunk';

/**
 * 予定編集ポップアップ
 */
export const SELECT_DATA_EVENT_EDIT_POPUP = 'SELECT_DATA_EVENT_EDIT_POPUP';
export const EDIT_EVENT_EDIT_POPUP = 'EDIT_EVENT_EDIT_POPUP';
export const SAVE_EDIT_POPUP = 'SAVE_EDIT_POPUP';
export const SELECT_JOB_EVENT_EDIT_POPUP = 'SELECT_JOB_EVENT_EDIT_POPUP';
export const CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP =
  'CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP';
export const FETCH_SUCCESS_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP =
  'FETCH_SUCCESS_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP';
export const FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP =
  'FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP';
export const SELECT_JOB_LIST_EVENT_EDIT_POPUP =
  'SELECT_JOB_LIST_EVENT_EDIT_POPUP';
export const ADD_JOB_LIST_EVENT_EDIT_POPUP = 'ADD_JOB_LIST_EVENT_EDIT_POPUP';
export const CLEAR_EVENT_EDIT_POPUP = 'CLEAR_EVENT_EDIT_POPUP';

// /planner/job-picklist/get から取得できるジョブ
type JobPickListItem = {
  jobId: string;
  jobCode: string;
  jobName: string;
  hasJobType: boolean;
};

/**
 * 有効なジョブリストをセットする
 * @param {array} jobList
 */
export const fetchSuccessActiveJobList = (
  jobList: JobPickListItem[]
): FetchSuccessActiveJobListEventEditPopupAction => {
  return {
    type: FETCH_SUCCESS_ACTIVE_JOB_LIST_EVENT_EDIT_POPUP,
    payload: jobList,
  };
};

/**
 * サーバーから取得したレスポンスからジョブリストを抽出する
 * @param {object} res
 * @return {array}
 */
const convertActiveJobList = (res: {
  activeJobList: JobPickListItem[];
}): JobPickListItem[] => {
  return res.activeJobList;
};

/**
 * 有効なジョブリストを取得する
 * @param {string} targetDate ISO8601形式の日付 YYYY-MM-DD
 * @param {JobPickListItem} 選択した予定に紐付いたジョブ
 */
export const fetchActiveJobList =
  (
    targetDate: string,
    selectedJob: JobPickListItem
  ): AppAction<Promise<void>> =>
  async (dispatch: AppDispatch): Promise<void> => {
    const req = {
      path: '/planner/job-picklist/get',
      param: { targetDate },
    };

    dispatch(loadingStart());

    return Api.invoke(req)
      .then((res) => {
        const activeJobList = convertActiveJobList(res);

        // 選択済みのジョブは、有効期限切れであっても選択リストに追加する
        if (selectedJob.jobId !== '') {
          const isSelectedJobExpired = activeJobList.every((job) => {
            return job.jobId !== selectedJob.jobId;
          });
          if (isSelectedJobExpired) {
            activeJobList.push(selectedJob);
          }
        }
        dispatch(fetchSuccessActiveJobList(activeJobList));
      })
      .catch((err) => catchApiError(err, { isContinuable: true }))
      .then(() => dispatch(loadingEnd()));
  };

/**
 * 予定の日付を変更した後に、ジョブリストを再取得する
 */
export const refreshActiveJobList =
  (event: CalendarEvent): AppAction =>
  (dispatch: AppDispatch): void => {
    const targetDate = DateUtil.formatISO8601Date(event.start.valueOf());

    const job: JobPickListItem = {
      jobId: event.job.id,
      jobCode: event.job.code,
      jobName: event.job.name,
      // appear work categories when expired
      hasJobType: true,
    };

    dispatch(fetchActiveJobList(targetDate, job));
  };

/**
 * 予定選択
 */
export const selectEventEditPopup =
  (event: CalendarEvent): AppAction =>
  (dispatch: AppDispatch): void => {
    const targetDate = DateUtil.formatISO8601Date(event.start.valueOf());

    const job: JobPickListItem = {
      jobId: event.job.id,
      jobCode: event.job.code,
      jobName: event.job.name,
      // appear work categories when expired
      hasJobType: true,
    };

    dispatch(fetchActiveJobList(targetDate, job));

    dispatch({
      type: SELECT_DATA_EVENT_EDIT_POPUP,
      payload: event,
    });
  };

/**
 * 予定編集
 */
export function editEventEditPopup(
  key: keyof CalendarState,
  value: boolean | string | moment.Moment
): EditEventEditPopupAction {
  return {
    type: EDIT_EVENT_EDIT_POPUP,
    payload: {
      key,
      value,
    },
  };
}

/**
 * ジョブを追加
 * @param {string} id
 * @param {string} name
 * @param {string} code
 */
export const addJobEventEditPopup = (
  job: Job
): AddJobListEventEditPopupAction => {
  return {
    type: ADD_JOB_LIST_EVENT_EDIT_POPUP,
    payload: job,
  };
};

/**
 * ダイアログよりジョブを選択、必要ならジョブリストにジョブを追加
 * @param {string} id
 * @param {string} name
 * @param {string} code
 */
export const selectJobFromDialog =
  (selectedJob: Job) =>
  (dispatch: Dispatch, getState: () => State): void => {
    const state = getState();
    const { jobList } = state.eventEditPopup;

    // 選択肢にないジョブの場合は追加を行う
    if (
      !_.find(jobList, (job) => {
        return job.jobId === selectedJob.id;
      })
    ) {
      dispatch(addJobEventEditPopup(selectedJob));
    }

    dispatch({
      type: SELECT_JOB_EVENT_EDIT_POPUP,
      payload: {
        id: selectedJob.id,
      },
    });
  };

/**
 * 作業分類取得成功
 * @param {Array} result 作業分類
 */
export const fetchWorkCategoryListSuccess = (
  result: WorkCategory[]
): FetchSuccessWorkCategoryListEventEditPopupAction => {
  return {
    type: FETCH_SUCCESS_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP,
    payload: result,
  };
};

/**
 * 作業分類取得
 * @param {String} jobId
 * @param {String} dateStr - YYYY-MM-DD
 */
export const fetchWorkCategoryList =
  (jobId: string, dateStr: string) =>
  (dispatch: Dispatch): Promise<void> => {
    const req = {
      path: '/time/work-category/get',
      param: {
        jobId,
        targetDate: dateStr,
      },
    };

    dispatch(loadingStart());

    return Api.invoke(req)
      .then((res: { workCategoryList: WorkCategory[] }) => {
        const activeWorkCategoryList = res.workCategoryList;
        dispatch(fetchWorkCategoryListSuccess(activeWorkCategoryList));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

/**
 * 保存されたイベントから作業分類リストを取得（ローディング非表示）
 * @param {String} jobId
 * @param {String} dateStr - utc
 */
export const fetchWorkCategoryListFromSavedEvent =
  (event: CalendarEvent) =>
  (dispatch: Dispatch): Promise<void> => {
    const jobId = event.job.id;
    const dateStr = event.start.format('YYYY-MM-DD');
    const req = {
      path: '/time/work-category/get',
      param: {
        jobId,
        targetDate: dateStr,
      },
    };

    return Api.invoke(req)
      .then((res: { workCategoryList: WorkCategory[] }) => {
        const activeWorkCategoryList = res.workCategoryList;

        // 現在選択されている作業分類が、現在有効期限切れであっても、選択リストに追加する
        if (
          event.job.id !== '' &&
          event.workCategoryId !== '' &&
          event.workCategoryName !== ''
        ) {
          const IsSelectedWorkCategoryExpired = activeWorkCategoryList.every(
            (workCategory) => {
              return workCategory.id !== event.workCategoryId;
            }
          );
          if (IsSelectedWorkCategoryExpired) {
            activeWorkCategoryList.push({
              id: event.workCategoryId,
              code: event.workCategoryCode,
              name: event.workCategoryName,
            });
          }
        }

        dispatch(fetchWorkCategoryListSuccess(activeWorkCategoryList));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

/**
 * 作業分類をクリア
 */
export function clearWorkCategoryList(): ClearWorkCategoryListEventEditPopupAction {
  return { type: CLEAR_WORK_CATEGORY_LIST_EVENT_EDIT_POPUP };
}

/**
 * ジョブを選択
 * @param {string} id
 */
export const selectJobEventEditPopup =
  (id: string): AppAction =>
  (dispatch: AppDispatch, getState: () => State): void => {
    dispatch(clearWorkCategoryList());

    if (id !== '') {
      const state = getState();
      const { start } = state.eventEditPopup.event;
      const targetDate = DateUtil.formatISO8601Date(start.valueOf());
      dispatch(fetchWorkCategoryList(id, targetDate));
    }

    dispatch({
      type: SELECT_JOB_EVENT_EDIT_POPUP,
      payload: {
        id,
      },
    });
  };

/**
 * イベント編集ポップアップオールクリア
 * @return {object}
 */
export const clearEventEditPopup = (): ClearEventEditPopupAction => {
  return {
    type: CLEAR_EVENT_EDIT_POPUP,
  };
};
