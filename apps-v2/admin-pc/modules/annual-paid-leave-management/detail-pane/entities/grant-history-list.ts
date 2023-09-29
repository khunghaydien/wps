import { Dispatch, Reducer } from 'redux';

import { createSelector } from 'reselect';

import {
  catchApiError,
  confirm,
  ConfirmDialogProps,
  loadingEnd,
  loadingStart,
  withLoading,
} from '../../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../../commons/actions/tab';
import Api from '../../../../../commons/api';
import msg from '../../../../../commons/languages';

import { GrantHistoryRecord } from '../../../../models/leave-management/types';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../../base/menu-pane/ui';
import { SEARCH_EMPLOYEE_SUCCESS } from '../../list-pane/entities/employee-list';
import { DESELECT_EMPLOYEE } from '../../list-pane/ui/employee-list';
import { hide } from '../../update-dialog/ui';

type ResponseBody = {
  records: GrantHistoryRecord[];
};

type State = {
  allIds: string[];
  byId: {
    [key: string]: GrantHistoryRecord;
  };
};

export const FETCH_SUCCESS =
  'MODULES/ANNUAL_PAID_LEAVE_MANAGEMENT/ENTITIES/GRANT_HISTORY_LIST/FETCH_SUCCESS';

export const DELETE_SUCCESS =
  'MODULES/ANNUAL_PAID_LEAVE_MANAGEMENT/ENTITIES/GRANT_HISTORY_LIST/DELETE_SUCCESS';

export const convertGrantHistoryRecords = (
  records: GrantHistoryRecord[]
): { allIds: Array<string>; byId: any } => ({
  allIds: (records as GrantHistoryRecord[]).map((record) => record.id),
  byId: Object.assign(
    {},
    ...(records as GrantHistoryRecord[]).map((record) => ({
      [record.id]: record,
    }))
  ),
});

const fetchSuccess = (body: ResponseBody) => ({
  type: FETCH_SUCCESS,
  payload: convertGrantHistoryRecords(body.records),
});

const deleteSuccess = () => ({
  type: DELETE_SUCCESS,
});

export const fetch =
  (targetEmployeeId: string, targetDate: string) =>
  (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());

    return Api.invoke({
      path: '/att/annual-leave/grant/list',
      param: {
        empId: targetEmployeeId,
        targetDate,
      },
    })
      .then((res: ResponseBody) => dispatch(fetchSuccess(res)))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

/**
 *
 * @param {string} grantId Granted annual paid leave ID
 * @param {string} targetEmployeeId Employee's ID
 * @param {Function} confirmDialog Function to show confirmation dialog
 *
 * Delete a Granted annual paid leave.
 * It receives confirm() as an argument to mock it  on the test.
 *
 * 付与された年次有給休暇を削除するか確認後、処理を実行するメソッド
 * 関数の中でconfirmをawaitしてしまっているためテストが止まってしまうので
 * テスト時にmockするためにconfirmを受け取る実装にしています。
 *
 */
export const deleteGrantedPaidHoliday =
  (
    grantId: string,
    targetEmployeeId: string,
    targetDate: string,
    confirmDialog: <T>(
      props: ConfirmDialogProps<T>,
      callback?: (arg0: boolean) => void
    ) => Function = confirm
  ) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    if (await dispatch(confirmDialog(msg().Admin_Msg_ConfirmDelete))) {
      try {
        await dispatch(
          withLoading(async () => {
            await Api.invoke({
              path: '/att/annual-leave/grant/delete',
              param: {
                grantId,
              },
            });
            dispatch(deleteSuccess());
            await dispatch(fetch(targetEmployeeId, targetDate));
            dispatch(hide());
          })
        );
      } catch (e) {
        dispatch(catchApiError(e, { isContinuable: true }));
      }
    }
  };

export const grantHistoryRecordsSelector = createSelector(
  (state) =>
    // @ts-ignore
    state.annualPaidLeaveManagement.detailPane.entities.grantHistoryList.allIds,
  (state) =>
    // @ts-ignore
    state.annualPaidLeaveManagement.detailPane.entities.grantHistoryList.byId,
  (allIds, byId) => allIds.map((id) => byId[id])
);

const initialState: State = {
  allIds: [],
  byId: {},
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    case SEARCH_EMPLOYEE_SUCCESS:
    case DESELECT_EMPLOYEE:
    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
      return initialState;

    case DELETE_SUCCESS:
    default:
      return state;
  }
}) as Reducer<State, any>;
