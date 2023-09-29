import { initDailyStampTime } from '../../commons/action-dispatchers/StampWidget';
import {
  catchApiError,
  catchBusinessError,
  confirm as confirmAction,
  loadingEnd,
  loadingStart,
  withLoading,
} from '../../commons/actions/app';
import Api from '../../commons/api';
import msg from '../../commons/languages';

import STATUS from '../../domain/models/approval/request/Status';
import { AttSummary as AttSummaryModel } from '../../domain/models/attendance/AttSummary';
import DailyRequestConditions from '../models/DailyRequestConditions';
import {
  ACTIONS_FOR_FIX,
  AttFixSummaryRequest as AttFixSummaryRequestModel,
  convertToCancelParam,
  convertToSubmitParam,
} from '@apps/domain/models/attendance/AttFixSummaryRequest';

import { actions as editingFixSummaryRequestActions } from '../modules/ui/editingFixSummaryRequest';

import FixSummaryRequestCheckDialog from '../components/dialogs/confirm/FixSummaryRequestCheckDialog';

import { AppDispatch } from './AppThunk';
import { fetchTimesheet } from './Timesheet';

/**
 * 未承認の申請が残っていないか確認する
 * - 未承認の申請が残っている場合は、状態に応じたメッセージを表示して、falseを返却
 * - 未承認の申請が残っていない場合は、アクションを発行せずtrueを返却
 * NOTE: 実装した後で、申請のマップだけ貰ったほうが率直だと気づいたが、将来的にメッセージに日付を含めるなど拡張の可能性もあるので、現状のままとした
 */
const checkForUnapprovedRequestNotLeft =
  (requestConditionsMap: { [date: string]: DailyRequestConditions }) =>
  (dispatch: AppDispatch) => {
    const hasStatusOf = Object.values(requestConditionsMap).reduce(
      (
        result: {
          invalid?: boolean;
          approvalIn?: boolean;
        },
        requestConditions
      ) => {
        switch (requestConditions.remarkableRequestStatus) {
          case STATUS.Rejected:
          case STATUS.Canceled:
          case STATUS.Recalled:
            result.invalid = true;
            break;

          case STATUS.ApprovalIn:
            result.approvalIn = true;
            break;

          default:
        }
        return result;
      },
      {}
    );

    if (hasStatusOf.invalid) {
      dispatch(
        catchBusinessError(
          msg().Com_Lbl_Error,
          msg().Att_Err_InvalidRequestExist,
          msg().Att_Slt_InvalidRequestExist
        )
      );
      return false;
    }

    if (hasStatusOf.approvalIn) {
      dispatch(
        catchBusinessError(
          msg().Com_Lbl_Error,
          msg().Att_Err_RequestingRequestExist,
          msg().Att_Slt_RequestingRequestExist
        )
      );
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
  (dispatch: AppDispatch) => {
    return dispatch(
      withLoading(() => {
        const req = {
          path: '/att/request/fix-summary/check',
          param: { summaryId },
        };
        return Api.invoke(req).catch((err) => {
          dispatch(catchApiError(err));
          return false;
        });
      })
    ).then((result) => {
      if (!result) {
        return false;
      }
      if (result.confirmation && result.confirmation.length) {
        return dispatch(
          confirm({
            Component: FixSummaryRequestCheckDialog,
            params: result,
          })
        );
      }
      return true;
    });
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
    requestConditionsMap: { [date: string]: DailyRequestConditions }
  ) =>
  (dispatch: AppDispatch) => {
    switch (attSummary.performableActionForFix) {
      case ACTIONS_FOR_FIX.Submit:
        const hasNoUnapprovedRequest = dispatch(
          checkForUnapprovedRequestNotLeft(requestConditionsMap)
        );
        console.log('***', requestConditionsMap, hasNoUnapprovedRequest);
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
    targetEmployeeId: string = null
  ) =>
  (dispatch: AppDispatch) => {
    const { Submit, CancelRequest, CancelApproval } = ACTIONS_FOR_FIX;

    const path = {
      [Submit]: '/att/request/fix-summary/submit',
      [CancelRequest]: '/att/request/fix-summary/cancel-request',
      [CancelApproval]: '/att/request/fix-summary/cancel-approval',
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
          dispatch(
            fetchTimesheet(resultTargetPeriodStartDate, targetEmployeeId)
          ),
          dispatch(initDailyStampTime()),
        ]);
      })
      .catch((err) => dispatch(catchApiError(err)))
      .then(() => {
        dispatch(loadingEnd());
      });
  };
