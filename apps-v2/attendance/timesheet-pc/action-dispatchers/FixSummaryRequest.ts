import {
  catchApiError,
  catchBusinessError,
  confirm as confirmAction,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import Api from '../../../commons/api';
import msg from '../../../commons/languages';

import AttendanceRequestRepository from '@attendance/repositories/AttAttendanceRequestRepository';

import DailyRequestConditions from '../models/DailyRequestConditions';
import { Status as DailyRequestStatus } from '@attendance/domain/models/AttDailyRequest';
import {
  ACTIONS_FOR_FIX,
  AttFixSummaryRequest as AttFixSummaryRequestModel,
  convertToCancelParam,
  convertToSubmitParam,
  Status as FixMonthlyRequestStatus,
} from '@attendance/domain/models/AttFixSummaryRequest';
import { AttSummary as AttSummaryModel } from '@attendance/domain/models/DeprecatedAttSummary';
import { LegalAgreementRequest } from '@attendance/domain/models/LegalAgreementRequest';
import { REASON } from '@attendance/domain/models/Result';

import { actions as editingFixSummaryRequestActions } from '../modules/ui/editingFixSummaryRequest';

import FixSummaryRequestCheckDialog from '../components/dialogs/confirm/FixSummaryRequestCheckDialog';

import UseCases from '../UseCases';
import { AppDispatch } from './AppThunk';
import { initDailyStampTime } from './StampWidget';
import canSubmitRequest from '@attendance/domain/services/FixMonthlyRequestService/canSubmitRequest';

/**
 * 未承認の申請が残っていないか確認する
 * - 未承認の申請が残っている場合は、状態に応じたメッセージを表示して、falseを返却
 * - 未承認の申請が残っていない場合は、アクションを発行せずtrueを返却
 * NOTE: 実装した後で、申請のマップだけ貰ったほうが率直だと気づいたが、将来的にメッセージに日付を含めるなど拡張の可能性もあるので、現状のままとした
 */
const checkForUnapprovedRequestNotLeft =
  (
    requestConditionsMap: { [date: string]: DailyRequestConditions },
    legalAgreementRequests?: LegalAgreementRequest[]
  ) =>
  (dispatch: AppDispatch) => {
    const records = Object.keys(requestConditionsMap).reduce(
      (hash, key) => {
        const record = requestConditionsMap[key];
        hash.push({
          recordDate: key,
          dailyRequestSummary: {
            status: record.remarkableRequestStatus,
          },
        });
        return hash;
      },
      [] as {
        recordDate: string;
        dailyRequestSummary: {
          status: DailyRequestStatus;
        };
      }[]
    );
    const result = canSubmitRequest({
      records,
      legalAgreementRequests,
    });
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
 * - 確定して問題ない／確認事項に同意を得られた場合 → 返却値のPromiseはtrueでresolveされる
 * - 確認事項に同意を得られない場合、もしくはAPIエラーの場合 → 返却値のPromiseはfalseで解決される
 * @return {Promise<Boolean>}
 */
const checkConditionsWithConfirm =
  (summaryId: string, confirm = confirmAction) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      const result = await AttendanceRequestRepository.isRequestAvailable({
        summaryId,
      });
      if (result.confirmation && result.confirmation.length) {
        dispatch(loadingEnd());
        const answer = await dispatch(
          // @ts-ignore
          confirm({
            Component: FixSummaryRequestCheckDialog,
            params: result,
          })
        );
        dispatch(loadingStart());
        return answer;
      }
      return true;
    } catch (err) {
      dispatch(catchApiError(err));
      return false;
    } finally {
      dispatch(loadingEnd());
    }
  };

/**
 * 勤務確定申請ダイアログを表示する
 * @param {AttSummary} attSummary
 */
const showRequestDialog =
  (attSummary: AttSummaryModel) => (dispatch: AppDispatch) => {
    const fixSummaryRequest: AttFixSummaryRequestModel = {
      summaryId: attSummary.id,
      requestId: attSummary.requestId,
      status: attSummary.status as FixMonthlyRequestStatus,
      comment: '',
      performableActionForFix: attSummary.performableActionForFix,
    };
    dispatch(editingFixSummaryRequestActions.set(fixSummaryRequest));
  };

/**
 * 勤務確定申請ダイアログを閉じる
 */
export const hideRequestDialog = editingFixSummaryRequestActions.unset;

/**
 * 勤務確定申請の状態にもとづいて、申請・取消などのインタラクションを発生させる
 * @param {AttSummary} attSummary
 */
export const manipulateFixRequestAccordingToAttSummary =
  (
    attSummary: AttSummaryModel,
    requestConditionsMap: { [date: string]: DailyRequestConditions },
    legalAgreementRequest?: LegalAgreementRequest[]
  ) =>
  (dispatch: AppDispatch) => {
    switch (attSummary.performableActionForFix) {
      case ACTIONS_FOR_FIX.Submit:
        const hasNoUnapprovedRequest = dispatch(
          checkForUnapprovedRequestNotLeft(
            requestConditionsMap,
            legalAgreementRequest
          )
        );
        if (hasNoUnapprovedRequest) {
          return dispatch(checkConditionsWithConfirm(attSummary.id)).then(
            (result) => {
              if (result) {
                dispatch(showRequestDialog(attSummary));
              }
            }
          );
        }
        return undefined;

      case ACTIONS_FOR_FIX.CancelRequest:
      case ACTIONS_FOR_FIX.CancelApproval:
        dispatch(showRequestDialog(attSummary));
        break;

      default:
    }

    return undefined;
  };

/**
 * 勤務確定申請を提出する＜申請／申請取消＞
 * @param {AttFixSummaryRequest} fixSummaryRequest
 * @param {String} resultTargetPeriodStartDate 成功時に再取得・表示する対象となる集計期間の起算日
 * @param {?String} [targetEmployeeId=null] The ID of target employee
 */
export const submit =
  (
    fixSummaryRequest: AttFixSummaryRequestModel,
    resultTargetPeriodStartDate: string,
    resultTargetPeriodEndDate: string,
    targetEmployeeId: string = null
  ) =>
  (dispatch: AppDispatch) => {
    const { Submit, CancelRequest, CancelApproval } = ACTIONS_FOR_FIX;

    const path = {
      [Submit]: '/att/request/fix-monthly/submit',
      [CancelRequest]: '/att/request/fix-monthly/cancel-request',
      [CancelApproval]: '/att/request/fix-monthly/cancel-approval',
    }[fixSummaryRequest.performableActionForFix];

    const req = {
      path,
      param:
        fixSummaryRequest.performableActionForFix === Submit
          ? convertToSubmitParam(fixSummaryRequest)
          : convertToCancelParam(fixSummaryRequest),
    };

    dispatch(loadingStart());

    return Api.invoke(req)
      .then(() => {
        dispatch(editingFixSummaryRequestActions.unset());
        return Promise.all([
          UseCases()
            .reloadTimesheetOnly({
              targetDate: resultTargetPeriodStartDate,
              employeeId: targetEmployeeId,
            })
            .then(({ timesheet }) => {
              const useViewTable = timesheet.workingTypeList?.some(
                (workType) => workType.attRecordDisplayFieldLayouts?.timesheet
              );
              if (useViewTable) {
                UseCases().fetchDailyFieldLayoutTable({
                  employeeId: targetEmployeeId,
                  startDate: resultTargetPeriodStartDate,
                  endDate: resultTargetPeriodEndDate,
                });
              }
            }),
          UseCases().fetchListLegalAgreementRequest({
            employeeId: targetEmployeeId,
            targetDate: resultTargetPeriodEndDate,
          }),
          // @ts-ignore
          dispatch(initDailyStampTime()),
        ]);
      })
      .catch((err) => dispatch(catchApiError(err)))
      .then(() => {
        dispatch(loadingEnd());
      });
  };
