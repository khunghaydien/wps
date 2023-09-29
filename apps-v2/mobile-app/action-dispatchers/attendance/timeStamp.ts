import { getUserSetting } from '../../../commons/actions/userSetting';
import { catchApiError } from '../../modules/commons/error';
import { endLoading, startLoading } from '../../modules/commons/loading';
import * as locationActions from '../../modules/commons/location';

import DailyStampTimeRepository from '@attendance/repositories/DailyStampTimeRepository';
import ManageCommuteCountRepository from '@attendance/repositories/ManageCommuteCountRepository';
import MobileSettingRepository from '@attendance/repositories/MobileSettingRepository';

import { CommuteCount } from '@attendance/domain/models/CommuteCount';
import {
  CLOCK_TYPE,
  DailyStampTime,
  MODE_TYPE,
  ModeType,
  STAMP_SOURCE,
} from '@attendance/domain/models/DailyStampTime';
import { MobileSetting } from '@attendance/domain/models/MobileSetting';

import { actions as mobileSettingActions } from '../../modules/attendance/mobileSetting';
import { actions as dailyStampTimeActions } from '../../modules/attendance/timeStamp/entities/dailyStampTime';
import { actions as uiActions } from '../../modules/attendance/timeStamp/ui';

import { AppDispatch } from '@apps/planner-pc/action-dispatchers/AppThunk';

import UseCases from '@mobile/containers/pages/attendance/TimeStampPageContainer/UseCases';

import { IInputData as IPostInputData } from '@attendance/domain/useCases/stampTime/IPostUseCase';

const MODE_TYPE_MAP = {
  [MODE_TYPE.CLOCK_IN]: CLOCK_TYPE.IN,
  [MODE_TYPE.CLOCK_OUT]: CLOCK_TYPE.OUT,
  [MODE_TYPE.CLOCK_REIN]: CLOCK_TYPE.REIN,
};

export type PostStampRequest = {
  mode: ModeType;
  comment?: string | null | undefined;
  latitude?: number;
  longitude?: number;
  commuteForwardCount?: number;
  commuteBackwardCount?: number;
};

export const createPostParam = (
  {
    mode,
    commuteForwardCount,
    commuteBackwardCount,
    comment,
    latitude,
    longitude,
  }: PostStampRequest,
  shouldSendLocation: boolean,
  hasLocation: boolean,
  useManageCommuteCount: boolean
): IPostInputData => ({
  clockType: MODE_TYPE_MAP[mode],
  comment,
  location:
    hasLocation &&
    (latitude || latitude === 0) &&
    (longitude || longitude === 0)
      ? {
          latitude,
          longitude,
        }
      : null,
  source: STAMP_SOURCE.MOBILE,
  commuteCount: useManageCommuteCount
    ? {
        forwardCount: commuteForwardCount,
        backwardCount: commuteBackwardCount,
      }
    : null,
  requiredLocation: shouldSendLocation,
});

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
      dispatch(setCommuteCount(dailyStampTime.commuteCount, mobileSetting));
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
  (commuteCount: CommuteCount, mobileSettings: MobileSetting) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(
        uiActions.setCommuteCount(
          commuteCount || {
            forwardCount: mobileSettings.defaultCommuteForwardCount,
            backwardCount: mobileSettings.defaultCommuteBackwardCount,
          }
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
        DailyStampTimeRepository.fetch(),
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

// 打刻+ローディング
export const stamp =
  (
    param: PostStampRequest,
    shouldSendLocation: boolean,
    willSendLocation: boolean,
    hasLocation: boolean,
    useManageCommuteCount: boolean
  ) =>
  async (dispatch: AppDispatch) => {
    await UseCases()
      .stampTime(
        createPostParam(
          param,
          shouldSendLocation,
          hasLocation,
          useManageCommuteCount
        )
      )
      // initialize を実行したいのでエラーは無視する
      .catch(() => false);
    dispatch(initialize(willSendLocation));
  };

// 通勤回数登録
export const pushCommuteCount =
  (commuteCount: CommuteCount) => async (dispatch: AppDispatch) => {
    const loadingId = dispatch(startLoading());
    try {
      await ManageCommuteCountRepository.update({
        commuteCount,
      });
      dispatch(uiActions.setCommuteCount(commuteCount));
    } catch (error) {
      dispatch(catchApiError(error, { isContinuable: true }));
    }
    dispatch(endLoading(loadingId));
  };
