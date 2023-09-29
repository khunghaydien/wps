import { bindActionCreators, Dispatch } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import * as DailyRestTimeFill from '../../domain/models/attendance/DailyRestTimeFill';
import {
  postStamp as apiPostStamp,
  PostStampRequest,
  STAMP_SOURCE,
} from '../../domain/models/attendance/DailyStampTime';

import { actions as commentActions } from '../modules/ui/comment';
import { actions as modalActions } from '../modules/ui/modal';

import StampApp from './App';

const CommonApp = (dispatch: Dispatch) =>
  bindActionCreators({ loadingStart, loadingEnd, catchApiError }, dispatch);

export default (dispatch: Dispatch) => {
  const app = CommonApp(dispatch);
  return {
    postStamp: async (param: PostStampRequest) => {
      app.loadingStart();
      try {
        const { insufficientRestTime } = await apiPostStamp(
          param,
          STAMP_SOURCE.WEB
        );
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
        await DailyRestTimeFill.post();
      } catch (error) {
        app.catchApiError(error, { isContinuable: true });
      } finally {
        app.loadingEnd();
      }
      dispatch(modalActions.closeModal());
    },
  };
};
