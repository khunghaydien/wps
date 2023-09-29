import { getUserSetting } from '../../../commons/actions/userSetting';
import BaseWSPError from '../../../commons/errors/BaseWSPError';
import msg from '../../../commons/languages';
import { showToast } from '../../../commons/modules/toast';
import TextUtil from '../../../commons/utils/TextUtil';
import { showConfirm } from '../../modules/commons/confirm';
import { catchApiError } from '../../modules/commons/error';
import { endLoading, startLoading } from '../../modules/commons/loading';
import * as locationActions from '../../modules/commons/location';

import ManageCommuteCountRepository from '@apps/repositories/attendance/ManageCommuteCountRepository';
import MobileSettingRepository from '@apps/repositories/attendance/MobileSettingRepository';

import * as DailyRestTimeFill from '../../../domain/models/attendance/DailyRestTimeFill';
import {
  CLOCK_TYPE,
  DailyStampTime,
  fetchDailyStampTime,
  postStamp as apiPostStamp,
  PostStampRequest,
  STAMP_SOURCE,
} from '../../../domain/models/attendance/DailyStampTime';
import { existRecordWithCommuteCount } from '@apps/domain/models/attendance/CommuteCount';
import { MobileSetting } from '@apps/domain/models/attendance/MobileSetting';

import { actions as mobileSettingActions } from '../../modules/attendance/mobileSetting';
import { actions as dailyStampTimeActions } from '../../modules/attendance/timeStamp/entities/dailyStampTime';
import { actions as uiActions } from '../../modules/attendance/timeStamp/ui';

import { AppDispatch } from '@apps/planner-pc/action-dispatchers/AppThunk';

export const onToggleSendLocation =
  (willSend: boolean) => (dispatch: AppDispatch) => {
    dispatch(uiActions.setWillSendLocation(willSend));
    if (willSend) {
      dispatch(locationActions.fetchLocation());
    } else {
      // 手動でチェックを外した場合は、現在地情報をクリアする
      dispatch(locationActions.unset());
    }
  };

/**
 * timestamp mobile performance improvement
 * update parallel API call and make the function independant from API call
 */
const setTimeStampAndCommute =
  (mobileSetting: MobileSetting, dailyStampTime: DailyStampTime) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(dailyStampTimeActions.set(dailyStampTime));
      dispatch(setCommuteCount(dailyStampTime, mobileSetting));
    } catch (error) {
      dispatch(catchApiError(error, { isContinuable: false }));
    }
  };

const getMobileSetting =
  (willSend: boolean) =>
  async (dispatch: AppDispatch): Promise<MobileSetting> => {
    try {
      const mobileSetting = await MobileSettingRepository.fetch();
      dispatch(
        onToggleSendLocation(
          mobileSetting.requireLocationAtMobileStamp && willSend
        )
      );
      dispatch(mobileSettingActions.initialize(mobileSetting));
      return mobileSetting;
    } catch (error) {
      dispatch(catchApiError(error, { isContinuable: false }));
    }
  };

const setCommuteCount =
  (
    commuteCount: {
      commuteForwardCount: number;
      commuteBackwardCount: number;
    },
    mobileSettings: MobileSetting
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const shouldUseDefaultCount = !existRecordWithCommuteCount(commuteCount);
      dispatch(
        uiActions.setCommuteCount(
          shouldUseDefaultCount
            ? mobileSettings.defaultCommuteForwardCount
            : commuteCount.commuteForwardCount,
          shouldUseDefaultCount
            ? mobileSettings.defaultCommuteBackwardCount
            : commuteCount.commuteBackwardCount
        )
      );
    } catch (error) {
      dispatch(catchApiError(error, { isContinuable: false }));
    }
  };

// 画面初期化
export const initialize =
  (willSend: boolean) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const loadingId = dispatch(startLoading());
    try {
      const [mobileSetting, dailyStampTime] = await Promise.all([
        dispatch(getMobileSetting(willSend)),
        fetchDailyStampTime(),
        dispatch(
          getUserSetting({
            skipApproverInfo: true,
            skipPsa: true,
            skipExpense: true,
          })
        ),
      ]);
      dispatch(setTimeStampAndCommute(mobileSetting, dailyStampTime));
    } finally {
      dispatch(endLoading(loadingId));
    }
  };

// 打刻
const postStamp =
  (
    param: PostStampRequest,
    shouldSendLocation: boolean,
    willSendLocation: boolean,
    hasLocation: boolean,
    useManageCommuteCount: boolean
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      if (shouldSendLocation && !hasLocation && !param.comment) {
        // @ts-ignore
        throw new BaseWSPError(
          msg().Com_Lbl_Error,
          msg().Att_Err_RequireCommentWithoutLocation
        );
      }
      const result = await apiPostStamp(
        param,
        STAMP_SOURCE.MOBILE,
        useManageCommuteCount
      );
      if (Number(result.insufficientRestTime)) {
        const confirmText = TextUtil.template(
          msg().Com_Msg_InsufficientRestTime,
          Number(result.insufficientRestTime)
        );

        if (await dispatch(showConfirm(confirmText))) {
          await DailyRestTimeFill.post();
        }
      }

      let stampDoneMsg = '';
      switch (param.mode) {
        case CLOCK_TYPE.CLOCK_IN:
          stampDoneMsg = msg().Att_Msg_TimeStampDoneIn;
          break;
        case CLOCK_TYPE.CLOCK_REIN:
          stampDoneMsg = msg().Att_Msg_TimeStampDoneRein;
          break;
        case CLOCK_TYPE.CLOCK_OUT:
          stampDoneMsg = msg().Att_Msg_TimeStampDoneOut;
          break;
        default:
          return;
      }
      dispatch(showToast(stampDoneMsg));

      dispatch(uiActions.clearComment());
    } catch (error) {
      dispatch(catchApiError(error, { isContinuable: true }));
    }
    dispatch(initialize(willSendLocation));
  };

// 打刻+通勤回数登録+ローディング
export const stamp =
  (
    param: PostStampRequest,
    shouldSendLocation: boolean,
    willSendLocation: boolean,
    hasLocation: boolean,
    useManageCommuteCount: boolean
  ) =>
  async (dispatch: AppDispatch) => {
    const loadingId = dispatch(startLoading());
    await dispatch(
      postStamp(
        param,
        shouldSendLocation,
        willSendLocation,
        hasLocation,
        useManageCommuteCount
      )
    );
    dispatch(endLoading(loadingId));
  };

// 通勤回数登録
export const pushCommuteCount =
  ({
    commuteForwardCount,
    commuteBackwardCount,
  }: {
    commuteForwardCount: number;
    commuteBackwardCount: number;
  }) =>
  async (dispatch: AppDispatch) => {
    const loadingId = dispatch(startLoading());
    try {
      await ManageCommuteCountRepository.update({
        commuteForwardCount,
        commuteBackwardCount,
      });
      dispatch(
        uiActions.setCommuteCount(commuteForwardCount, commuteBackwardCount)
      );
    } catch (error) {
      dispatch(catchApiError(error, { isContinuable: true }));
    }
    dispatch(endLoading(loadingId));
  };
