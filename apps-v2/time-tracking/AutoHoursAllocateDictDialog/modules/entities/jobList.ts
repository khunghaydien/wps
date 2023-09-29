import uniqBy from 'lodash/uniqBy';

import {
  Job,
  JobPickList,
  JobPickListItem,
} from '@apps/domain/models/time-tracking/Job';

// State

type State = {
  byId: { [id: string]: JobPickListItem };
  allIds: string[];
};

const initialState = { byId: {}, allIds: [] };

// Actions

const ActionType = {
  ADD: '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/ENTITIES/JOB_LIST/ADD_JOB_LIST',
  FETCH_SUCCESS:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/ENTITIES/JOB_LIST/FETCH_SUCCESS_ACTIVE_JOB_LIST',
} as const;

type AddJobListAction = {
  type: typeof ActionType.ADD;
  payload: Job;
};

type FetchSuccessActiveJobListAction = {
  type: typeof ActionType.FETCH_SUCCESS;
  payload: {
    jobList: JobPickListItem[];
    allocateJobList: JobPickListItem[];
  };
};

type Action = AddJobListAction | FetchSuccessActiveJobListAction;

export const actions = {
  addJobList: (job: Job): AddJobListAction => ({
    type: ActionType.ADD,
    payload: job,
  }),
  fetchSuccessActiveJob: (
    jobList: JobPickListItem[],
    allocateJobList: JobPickListItem[]
  ): FetchSuccessActiveJobListAction => ({
    type: ActionType.FETCH_SUCCESS,
    payload: {
      jobList,
      allocateJobList,
    },
  }),
};

/**
 * 初期データ取得に含まれるジョブをjobListに追加
 */
export const addRemoteListJobToJobPickList = (
  jobList: JobPickListItem[],
  allocateJobList: JobPickListItem[]
): JobPickListItem[] => {
  return uniqBy([...jobList, ...allocateJobList], 'jobId');
};

/**
 * サーバーから取得したレスポンスからジョブリストを抽出する
 */
const convertActiveJobList = (
  activeJobList: JobPickListItem[]
): JobPickList => {
  const byId = {};
  const allIds = [];
  activeJobList.forEach((item) => {
    byId[item.jobId] = item;
    allIds.push(item.jobId);
  });
  return {
    byId,
    allIds,
  };
};

// Reducer

export default function jobListReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ActionType.ADD:
      const { id, name, code, hasJobType } = (action as AddJobListAction)
        .payload;

      // 選択肢にないジョブの場合は追加を行う
      if (!state.byId[id]) {
        return {
          byId: {
            ...state.byId,
            [id]: {
              jobId: id,
              jobName: name,
              jobCode: code,
              hasJobType,
            },
          },
          allIds: state.allIds.concat([id]),
        };
      } else {
        return state;
      }
    case ActionType.FETCH_SUCCESS:
      const { jobList, allocateJobList } = (
        action as FetchSuccessActiveJobListAction
      ).payload;
      const activeList =
        allocateJobList.length > 0
          ? addRemoteListJobToJobPickList(jobList, allocateJobList)
          : jobList;

      return convertActiveJobList(activeList);
    default:
      return state;
  }
}
