import { DailyTrackList } from '@apps/domain/models/time-tracking/DailyTrackList';
import { TaskForSummary } from '@apps/domain/models/time-tracking/TrackRequest';

import { constants as requestConstants } from '../../../ui/timeTrack/request';

type State = {
  employeeName: string;
  employeePhotoUrl: string;
  status: string;
  comment: string;
  startDate: string;
  endDate: string;
  dailyTrackList: DailyTrackList;
  taskList: {
    allIds: string[];
    byId: { [id: string]: TaskForSummary };
  };
  taskIdList?: string[];
  requestId: string;
};

const initialState: State = {
  employeeName: '',
  employeePhotoUrl: '',
  status: '',
  comment: '',
  startDate: '',
  endDate: '',
  dailyTrackList: {},
  taskList: {
    allIds: [],
    byId: {},
  },
  taskIdList: [],
  requestId: '',
};

// CONSTANTS
const FETCH_SUCCESS = 'MODULES/ENTITIES/TIME_TRACK/DETAIL/FETCH_SUCCESS';

export const constants = {
  FETCH_SUCCESS,
};

// ACTIONS
export const fetchSuccess = (payload) => {
  return {
    type: FETCH_SUCCESS,
    payload,
  };
};

// REDUCER
export default (state: State = initialState, action): State => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        employeeName: action.payload.employeeName,
        employeePhotoUrl: action.payload.employeePhotoUrl,
        status: action.payload.status,
        comment: action.payload.comment,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        dailyTrackList: action.payload.dailyList,
        taskList: {
          byId: action.payload.taskList,
          allIds: action.payload.summaryTaskAllIds,
        },
        requestId: action.payload.requestId,
      };
    case requestConstants.APPROVE_SUCCESS:
    case requestConstants.REJECT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
