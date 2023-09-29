import * as appActions from '@apps/commons/actions/app';

// FIXME: ここで非同期処理をしたくない
import FixMonthlyRequestRepository from '@attendance/repositories/approval/FixMonthlyRequestRepository';

import {
  convert,
  FixMonthlyRequestViewModel,
} from '@apps/approvals-pc/models/attendance/FixMonthlyRequestViewModel';
import { FixMonthlyRequest as DomainFixMonthlyRequest } from '@attendance/domain/models/approval/FixMonthlyRequest';

/** Define constants */

const FETCH_SUCCESS =
  'MODULES/ENTITIES/ATT_MONTHLY/DETAIL/FETCH_SUCCESS' as const;
// Used when there're no requests to show
const CLEAR = 'MODULES/ENTITIES/ATT_MONTHLY/DETAIL/CLEAR' as const;

export const constants = { FETCH_SUCCESS, CLEAR };

/** Define actions */

type FetchSuccessAction = {
  type: typeof FETCH_SUCCESS;
  payload: DomainFixMonthlyRequest;
};

const fetchSuccess = (result: DomainFixMonthlyRequest): FetchSuccessAction => ({
  type: FETCH_SUCCESS,
  payload: result,
});

const browse =
  (requestId: string) =>
  async (dispatch): Promise<void> => {
    dispatch(appActions.loadingStart());
    try {
      const result = await FixMonthlyRequestRepository.fetch(requestId);
      dispatch(fetchSuccess(result));
    } catch (err) {
      dispatch(appActions.catchApiError(err, { isContinuable: true }));
    } finally {
      dispatch(appActions.loadingEnd());
    }
  };

type ClearAction = {
  type: typeof CLEAR;
};

const clear = (): ClearAction => ({
  type: CLEAR,
});

type Actions = FetchSuccessAction | ClearAction;

export const actions = { browse, clear };

/** Define reducer */
type State = FixMonthlyRequestViewModel;

const initialState: State = {
  id: null,
  status: null,
  submitter: {
    employee: {
      name: '',
      code: '',
      photoUrl: '',
      department: {
        name: '',
      },
    },
    delegator: {
      employee: {
        name: '',
      },
    },
  },
  ownerInfos: [],
  comment: '',
  startDate: null,
  endDate: null,
  records: [],
  recordTotal: {
    restTime: 0,
    realWorkTime: 0,
    overTime: 0,
    nightTime: 0,
    lostTime: 0,
    virtualWorkTime: 0,
    holidayWorkTime: 0,
  },
  summaries: [],
  dividedSummaries: null,
  attention: {
    ineffectiveWorkingTime: 0,
    insufficientRestTime: 0,
  },
  dailyAllowanceRecords: [],
  dailyObjectiveEventLogRecords: [],
  dailyRestRecords: [],
  displayFieldLayout: null,
  workingType: {
    useAllowanceManagement: false,
    useManageCommuteCount: false,
    useObjectivelyEventLog: false,
    useRestReason: false,
  },
  historyList: [],
};

export default (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return convert({
        ...state,
        ...action.payload,
      });
    case CLEAR:
      return initialState;
    default:
      return state;
  }
};
