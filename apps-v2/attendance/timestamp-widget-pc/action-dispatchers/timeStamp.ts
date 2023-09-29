import { bindActionCreators, Dispatch } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';

import DailyRecordRepository from '@attendance/repositories/DailyRecordRepository';
import DailyStampTimeRepository from '@attendance/repositories/DailyStampTimeRepository';

import {
  CLOCK_TYPE,
  MODE_TYPE,
  ModeType,
  STAMP_SOURCE,
} from '@attendance/domain/models/DailyStampTime';

import { actions as commentActions } from '../modules/ui/comment';
import { actions as modalActions } from '../modules/ui/modal';

import StampApp from './App';

const MODE_TYPE_MAP = {
  [MODE_TYPE.CLOCK_IN]: CLOCK_TYPE.IN,
  [MODE_TYPE.CLOCK_OUT]: CLOCK_TYPE.OUT,
  [MODE_TYPE.CLOCK_REIN]: CLOCK_TYPE.REIN,
};

const CommonApp = (dispatch: Dispatch) =>
  bindActionCreators({ loadingStart, loadingEnd, catchApiError }, dispatch);

export default (dispatch: Dispatch) => {
  const app = CommonApp(dispatch);
  return {
    postStamp: async (param: { mode: ModeType; comment: string }) => {
      app.loadingStart();
      try {
        const { insufficientRestTime } = await DailyStampTimeRepository.post({
          clockType: MODE_TYPE_MAP[param.mode],
          comment: param.comment,
          source: STAMP_SOURCE.WEB,
        });
        if (
          insufficientRestTime !== null &&
          insufficientRestTime !== undefined &&
          insufficientRestTime !== 0
        ) {
          dispatch(modalActions.showModal(insufficientRestTime));
        }

        dispatch(commentActions.clear());
      } catch (error) {
        app.catchApiError(error, { isContinuable: true });
      } finally {
        app.loadingEnd();
      }
      StampApp(dispatch).initialize();
    },
    addInsufficientRestTime: async () => {
      app.loadingStart();
      try {
        await DailyRecordRepository.fillRestTime();
      } catch (error) {
        app.catchApiError(error, { isContinuable: true });
      } finally {
        app.loadingEnd();
      }
      dispatch(modalActions.closeModal());
    },
  };
};
