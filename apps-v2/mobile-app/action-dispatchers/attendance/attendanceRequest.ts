import msg from '@apps/commons/languages';
import { showConfirm } from '@mobile/modules/commons/confirm';
import {
  catchApiError,
  catchBusinessError,
} from '@mobile/modules/commons/error';
import { endLoading, startLoading } from '@mobile/modules/commons/loading';

import AttendanceRequestRepository from '@attendance/repositories/AttAttendanceRequestRepository';

import {
  ACTIONS_FOR_FIX,
  AttFixSummaryRequest,
  convertToCancelParam,
  convertToSubmitParam,
} from '@attendance/domain/models/AttFixSummaryRequest';
import { REASON } from '@attendance/domain/models/Result';

import { AttDailyRecord } from '@mobile/modules/attendance/timesheet/entities';

import { AppDispatch } from '../AppThunk';
import { initialize } from './monthlyRecords';
import askIgnoreWarning from './userPrompts/askAttendanceRequestIgnoreWarning';
import canSubmitRequest from '@attendance/domain/services/FixMonthlyRequestService/canSubmitRequest';

/**
 * 未承認の申請が残っていないか確認する
 */
const checkForUnapprovedRequestNotLeft =
  (records: AttDailyRecord[]) =>
  (dispatch: AppDispatch): boolean => {
    const $records = records.map(({ remarkableRequestStatus }) => ({
      dailyRequestSummary: remarkableRequestStatus,
    }));
    const result = canSubmitRequest({ records: $records });

    if (result.result === false) {
      if (result.reason === REASON.EXISTED_INVALID_REQUEST) {
        dispatch(
          catchBusinessError(
            msg().Com_Lbl_Error,
            msg().Att_Err_InvalidRequestExist,
            msg().Att_Slt_InvalidRequestExist
          )
        );
      } else if (result.reason === REASON.EXISTED_SUBMITTING_REQUEST) {
        dispatch(
          catchBusinessError(
            msg().Com_Lbl_Error,
            msg().Att_Err_RequestingRequestExist,
            msg().Att_Slt_RequestingRequestExist
          )
        );
      }
      return false;
    }
    return true;
  };

/**
 * 勤務確定申請して問題ないかAPIに問い合わせる／確認事項があればユーザの同意を得る
 * @return {Promise<Boolean>}
 */
const checkConditionsWithConfirm =
  (summaryId: string) => async (dispatch: AppDispatch) => {
    const loadingId = dispatch(startLoading());
    try {
      const result = await AttendanceRequestRepository.isRequestAvailable({
        summaryId,
      });
      if (result.confirmation && result.confirmation.length) {
        const answer = await dispatch(askIgnoreWarning(result.confirmation));
        return answer;
      }
      return true;
    } catch (err) {
      dispatch(catchApiError(err));
      return false;
    } finally {
      dispatch(endLoading(loadingId));
    }
  };

const submit =
  ({
    targetDate,
    request,
    records,
  }: {
    targetDate: string;
    request: AttFixSummaryRequest;
    records: AttDailyRecord[];
  }) =>
  async (dispatch: AppDispatch) => {
    if (!(await dispatch(showConfirm(msg().Att_Msg_FixSummaryConfirmSubmit)))) {
      return;
    }
    if (!dispatch(checkForUnapprovedRequestNotLeft(records))) {
      return;
    }
    if (!(await dispatch(checkConditionsWithConfirm(request.summaryId)))) {
      return;
    }

    const loadingId = dispatch(startLoading());
    try {
      await AttendanceRequestRepository.submit(convertToSubmitParam(request));
      await dispatch(initialize(targetDate));
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(endLoading(loadingId));
    }
  };

const cancelRequest =
  ({
    targetDate,
    request,
  }: {
    targetDate: string;
    request: AttFixSummaryRequest;
  }) =>
  async (dispatch: AppDispatch) => {
    if (
      !(await dispatch(showConfirm(msg().Appr_Msg_RequestConfirmCancelRequest)))
    ) {
      return;
    }

    const loadingId = dispatch(startLoading());
    try {
      await AttendanceRequestRepository.cancelRequest(
        convertToCancelParam(request)
      );
      await dispatch(initialize(targetDate));
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(endLoading(loadingId));
    }
  };

const cancelApproval =
  ({
    targetDate,
    request,
  }: {
    targetDate: string;
    request: AttFixSummaryRequest;
  }) =>
  async (dispatch: AppDispatch) => {
    if (
      !(await dispatch(
        showConfirm(msg().Appr_Msg_RequestConfirmCancelApproval)
      ))
    ) {
      return;
    }

    const loadingId = dispatch(startLoading());
    try {
      await AttendanceRequestRepository.cancelApproval(
        convertToCancelParam(request)
      );
      await dispatch(initialize(targetDate));
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(endLoading(loadingId));
    }
  };

/**
 * 勤務確定申請の状態にもとづいて、申請・取消などのインタラクションを発生させる
 */
export const interact =
  ({
    targetDate,
    request,
    records,
  }: {
    targetDate: string;
    request: AttFixSummaryRequest;
    records: AttDailyRecord[];
  }) =>
  async (dispatch: AppDispatch): Promise<void> => {
    switch (request.performableActionForFix) {
      case ACTIONS_FOR_FIX.Submit:
        await dispatch(submit({ targetDate, request, records }));
        break;
      case ACTIONS_FOR_FIX.CancelRequest:
        await dispatch(cancelRequest({ targetDate, request }));
        break;
      case ACTIONS_FOR_FIX.CancelApproval:
        await dispatch(cancelApproval({ targetDate, request }));
        break;
      default:
    }
  };
