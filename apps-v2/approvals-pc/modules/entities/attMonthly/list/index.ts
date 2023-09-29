import { createSelector } from 'reselect';

import * as appActions from '../../../../../commons/actions/app';
import Api from '../../../../../commons/api';

import { ApprovalTypeValue } from '../../../../../domain/models/approval/ApprovalType';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import { actions as detailActions } from '../detail/index';

type State = {
  allIds: string[];
  byId: {
    [id: string]: { id: string };
  };
  overLimit: boolean;
};

/** Define constants */

const FETCH_SUCCESS = 'MODULES/ENTITIES/ATT_MONTHLY/LIST/FETCH_SUCCESS';
const CLEAR = 'MODULES/ENTITIES/ATT_MONTHLY/LIST/CLEAR';
const LIMIT = 1000;
export const constants = { FETCH_SUCCESS, CLEAR };

/** Define converters */

const convertRequestList = (requestList: Array<{ id: string }>): State => ({
  allIds: requestList.slice(0, LIMIT).map((req) => req.id),
  byId: Object.assign(
    {},
    ...requestList.slice(0, LIMIT).map((req) => ({ [req.id]: req }))
  ),
  overLimit: requestList.length > LIMIT,
});

/** Define actions */
type FetchSuccessAction = {
  type: 'MODULES/ENTITIES/ATT_MONTHLY/LIST/FETCH_SUCCESS';
  payload: State;
};

const fetchSuccess =
  (result, selectedId?: string | null) => (dispatch: AppDispatch) => {
    const requestList = convertRequestList(result.requestList);
    const { allIds } = requestList;

    if (selectedId !== null) {
      const browsingTargetId =
        selectedId && allIds.includes(selectedId) ? selectedId : allIds[0];

      // If the list has no size, there will be nothing to show
      if (browsingTargetId) {
        dispatch(detailActions.browse(browsingTargetId));
      } else {
        dispatch(detailActions.clear());
      }
    } else {
      dispatch(detailActions.clear());
    }

    dispatch({
      type: constants.FETCH_SUCCESS,
      payload: requestList,
    });
  };

/**
 * Create an event to fetch request list from remote and update state.
 * The request with specified index will be shown after loading.
 * @param {ApprovalTypeValue} approvalType
 * @param {string | null} [selectedId]
 * @return {function} Action to pass to action dispatcher.
 * @example
 * dispatch(listActions.browse(browseId))
 */
const browse =
  (approvalType: ApprovalTypeValue, selectedId?: string | null) =>
  (dispatch: AppDispatch) => {
    const req = {
      path: '/att/request-list/monthly/get',
      param: { approvalType },
    };

    dispatch(appActions.loadingStart());
    return Api.invoke(req)
      .then((result) => dispatch(fetchSuccess(result, selectedId)))
      .catch((err) =>
        dispatch(appActions.catchApiError(err, { isContinuable: false }))
      )
      .then(() => dispatch(appActions.loadingEnd()));
  };

type ClearAction = {
  type: 'MODULES/ENTITIES/ATT_MONTHLY/LIST/CLEAR';
};

const clear = (): ClearAction => ({ type: CLEAR });

export const actions = { browse, clear };

type Action = FetchSuccessAction | ClearAction;

/** Define selectors */

const getRequestList = (state) => state.entities.attMonthly.list;

const requestListSelector = createSelector(getRequestList, (requestList) =>
  requestList.allIds.map((id) => requestList.byId[id])
);

export const selectors = { requestListSelector };

/** Define reduce */

const initialState: State = {
  allIds: [],
  byId: {},
  overLimit: false,
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return (action as FetchSuccessAction).payload;

    case CLEAR:
      return initialState;

    default:
      return state;
  }
};
