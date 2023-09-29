// eslint-disable-next-line simple-import-sort/imports
import * as React from 'react';
import filter from 'lodash/fp/filter';
import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import TextUtil from '@apps/commons/utils/TextUtil';
import { useDispatch, useSelector } from 'react-redux';
import { showConfirm } from '@mobile/modules/commons/confirm';
import { showAlert } from '@mobile/modules/commons/alert';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import msg from '@apps/commons/languages';
import { showToast } from '@apps/commons/modules/toast';
import { State } from '@mobile/modules';

import { endLoading, startLoading } from '@mobile/modules/commons/loading';
import { catchApiError } from '@mobile/modules/commons/error';

import RequestRepository from '@apps/repositories/approval/RequestRepository';
import RequestListRepository from '@apps/repositories/approval/RequestListRepository';

import Component from '@mobile/components/pages/approval/ListPage';
import { RouteComponentProps } from 'react-router-dom';
import {
  setComment,
  initialize as initializeComment,
} from '@mobile/modules/approval/ui/list';
import { actions as detailActions } from '@mobile/modules/approval/ui/detail';
import { actions as attendanceRequestActions } from '@mobile/modules/approval/entities/attendance/attendanceRequest';
import {
  setFilterType,
  setRecords,
  FilterType,
  initialize,
  checkAll,
  toggle,
  toggleAll,
  CHECKED_MAX,
} from '@mobile/modules/approval/entities/list';
import {
  ApprRequest,
  REQUEST_TYPE,
} from '@apps/domain/models/approval/request/Request';

import { AppDispatch } from '@mobile/action-dispatchers/AppThunk';

type RequestTypeGroup = {
  available: boolean;
  item: {
    label: string;
    value: FilterType;
  };
};

export { CHECKED_MAX };

const useUseCases = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;
  const load = React.useCallback(async () => {
    const loadingId = dispatch(startLoading()) as unknown as string;
    try {
      const list = await RequestListRepository.fetch();
      dispatch(setRecords(list));
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(endLoading(loadingId));
    }
  }, [dispatch]);
  const approve = React.useCallback(
    async ({
      ids,
      comment,
    }: {
      ids: string[];
      comment: string;
    }): Promise<boolean> => {
      const answer = await dispatch(
        showConfirm(
          TextUtil.template(
            msg().Appr_Msg_RequestConfirmApprovalBulk,
            ids.length
          )
        )
      );
      if (!answer) {
        return false;
      }
      const loadingId = dispatch(startLoading()) as unknown as string;
      try {
        await RequestRepository.approve({
          ids,
          comment,
        });
        dispatch(initializeComment());
        dispatch(showToast(msg().Appr_Lbl_Approved));
        return true;
      } catch (err) {
        dispatch(catchApiError(err));
      } finally {
        dispatch(endLoading(loadingId));
      }
    },
    [dispatch]
  );

  return {
    load,
    approve,
  };
};

const useFilterTypeOptions = () => {
  const userSetting = useSelector((state: State) => state.userSetting);
  const requestTypeGroups: RequestTypeGroup[] = React.useMemo(
    () => [
      {
        available: true,
        item: { label: msg().Com_Sel_All, value: 'all' },
      },
      {
        available:
          userSetting.useAttendance && userSetting.viewAttDailyRequestApproval,
        item: {
          label: msg().Appr_Lbl_AttendanceRequest,
          value: REQUEST_TYPE.ATTENDANCE_DAILY,
        },
      },
      {
        available:
          userSetting.useAttendance && userSetting.viewAttRequestApproval,
        item: {
          label: msg().Appr_Lbl_AttMonthlyRequest,
          value: REQUEST_TYPE.ATTENDANCE_FIX,
        },
      },
    ],
    [userSetting]
  );
  const filterTypeOptions = React.useMemo(
    () =>
      flow(
        filter<RequestTypeGroup>((group) => group.available),
        map((group) => group.item)
      )(requestTypeGroups),
    [requestTypeGroups]
  );
  return filterTypeOptions;
};

const Container: React.FC<
  {
    back: boolean;
  } & RouteComponentProps
> = ({ back, ...router }) => {
  const dispatch = useDispatch();
  const useCases = useUseCases();
  const canBulkApproveAttDailyRequest = useSelector(
    (state: State) =>
      state.common.accessControl.permission.canBulkApproveAttDailyRequest
  );
  const canBulkApproveAttRequest = useSelector(
    (state: State) =>
      state.common.accessControl.permission.canBulkApproveAttRequest
  );
  const canUseCheckAll = React.useMemo(
    () => canBulkApproveAttDailyRequest || canBulkApproveAttRequest,
    [canBulkApproveAttDailyRequest, canBulkApproveAttRequest]
  );
  const filterType = useSelector(
    (state: State) => state.approval.entities.list.filterType
  );
  const records = useSelector(
    (state: State) => state.approval.entities.list.filteredList
  );
  const targetRecords = useSelector(
    (state: State) => state.approval.entities.list.targetList
  );
  const checked = useSelector(
    (state: State) => state.approval.entities.list.checked
  );
  const checkedAll = useSelector(
    (state: State) => state.approval.entities.list.checkedAll
  );
  const comment = useSelector((state: State) => state.approval.ui.list.comment);
  const filterTypeOptions = useFilterTypeOptions();
  const hasPermissionError =
    Object.keys(filterTypeOptions).length > 1
      ? null
      : {
          message: msg().Att_Err_CannotDisplayAttendance,
          description: msg().Att_Msg_Inquire,
        };

  const isCanUseChecked = React.useCallback(
    ({ requestId }: ApprRequest) =>
      targetRecords.find(
        ({ requestId: $requestId }) => requestId === $requestId
      ),
    [targetRecords]
  );
  const $checkAll = React.useCallback(() => {
    dispatch(checkAll());
  }, [dispatch]);
  const onClickRefresh = React.useCallback(() => {
    router.history.push(`/approval/list`);
  }, [router]);
  const onChangeFilter = React.useCallback(
    (filterType) => {
      dispatch(setFilterType(filterType));
      $checkAll();
    },
    [dispatch, $checkAll]
  );
  const onClickRow = React.useCallback(
    ({ requestId, requestType }: ApprRequest) => {
      router.history.push(`/approval/list/select/${requestType}/${requestId}`);
    },
    [router]
  );
  const onCheck = React.useCallback(
    (record: ApprRequest) => {
      if (!isCanUseChecked(record)) {
        onClickRow(record);
        return;
      }
      if (
        CHECKED_MAX <= checked.length &&
        !checked.includes(record.requestId)
      ) {
        (dispatch as (dispatch: AppDispatch) => Promise<void>)(
          showAlert(msg().Appr_Msg_MaxSelectedWhenSelecting)
        );
        return;
      }
      dispatch(toggle(record.requestId));
    },
    [dispatch, isCanUseChecked, onClickRow, checked]
  );
  const onCheckAll = React.useCallback(() => {
    dispatch(toggleAll());
  }, [dispatch]);
  const onChangeComment = React.useCallback(
    (comment: string) => {
      dispatch(setComment(comment));
    },
    [dispatch]
  );
  const onClickApproveButton = React.useCallback(async () => {
    const result = await useCases.approve({
      ids: checked,
      comment,
    });
    if (!result) {
      return;
    }
    await useCases.load();
  }, [checked, comment, useCases]);

  React.useEffect(() => {
    (async () => {
      if (!back) {
        dispatch(
          initialize({
            canBulkApproveAttDailyRequest,
            canBulkApproveAttRequest,
          })
        );
        await useCases.load();
        dispatch(initializeComment());
        dispatch(setFilterType(filterType));
        $checkAll();
      } else {
        await useCases.load();
      }
      dispatch(detailActions.initialize());
      dispatch(attendanceRequestActions.clear());
    })();
  }, []);

  return (
    <Component
      {...{
        filterType,
        filterTypeOptions,
        records,
        checked,
        checkedAll,
        canUseCheckAll,
        comment,
        onClickRefresh,
        onChangeFilter,
        onCheckAll,
        onCheck,
        onClickRow,
        onChangeComment,
        onClickApproveButton,
        hasPermissionError,
      }}
    />
  );
};

export default Container;
