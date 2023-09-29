import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useOnResume from '@apps/commons/hooks/useOnResume';
import { selectors as appSelectors } from '@apps/commons/modules/app';

import { CLOCK_TYPE } from '../../domain/models/attendance/DailyStampTime';

import { State } from '../modules';
import { actions as commentActions } from '../modules/ui/comment';
import { actions as modalActions } from '../modules/ui/modal';

import App from '../action-dispatchers/App';
import TimeStamp from '../action-dispatchers/timeStamp';

import TimestampWidget from '../components/TimestampWidget';

const TimestampWidgetContainer = () => {
  const loading = useSelector((state: State) =>
    appSelectors.loadingSelector(state)
  );
  const comment = useSelector((state: State) => state.ui.comment.comment);
  const insufficientRestTime = useSelector(
    (state: State) => state.ui.modal.insufficientRestTime
  );
  const isShowModal = useSelector((state: State) => state.ui.modal.isShowModal);
  const isEnableStartStamp = useSelector(
    (state: State) => state.entities.dailyStampTime.isEnableStartStamp
  );
  const isEnableEndStamp = useSelector(
    (state: State) => state.entities.dailyStampTime.isEnableEndStamp
  );
  const isEnableRestartStamp = useSelector(
    (state: State) => state.entities.dailyStampTime.isEnableRestartStamp
  );

  const dispatch = useDispatch();

  const timeStamp = TimeStamp(dispatch);

  const app = App(dispatch);

  const onChange = useCallback(
    (value: string) => {
      dispatch(commentActions.edit(value));
    },
    [comment]
  );

  const onClickStartStampButton = useCallback(() => {
    timeStamp.postStamp({
      mode: isEnableRestartStamp ? CLOCK_TYPE.CLOCK_REIN : CLOCK_TYPE.CLOCK_IN,
      comment,
    });
  }, [isEnableStartStamp, isEnableEndStamp, isEnableRestartStamp, comment]);

  const onClickEndStampButton = useCallback(() => {
    timeStamp.postStamp({
      mode: CLOCK_TYPE.CLOCK_OUT,
      comment,
    });
  }, [isEnableStartStamp, isEnableEndStamp, isEnableRestartStamp, comment]);

  const onClickSubmitButton = useCallback(() => {
    timeStamp.addInsufficientRestTime();
  }, [insufficientRestTime, isShowModal]);

  const onClickCancelButton = useCallback(() => {
    dispatch(modalActions.closeModal());
  }, [isShowModal]);

  const handler = React.useCallback(() => {
    if (loading) {
      return;
    }
    return app.reload();
  }, [loading, app]);

  useOnResume(handler);

  return (
    <TimestampWidget
      onChange={onChange}
      comment={comment}
      insufficientRestTime={insufficientRestTime}
      isShowModal={isShowModal}
      isEnableStartStamp={isEnableStartStamp}
      isEnableEndStamp={isEnableEndStamp}
      isEnableRestartStamp={isEnableRestartStamp}
      onClickStartStampButton={onClickStartStampButton}
      onClickEndStampButton={onClickEndStampButton}
      onClickCancelButton={onClickCancelButton}
      onClickSubmitButton={onClickSubmitButton}
    />
  );
};

export default TimestampWidgetContainer;
