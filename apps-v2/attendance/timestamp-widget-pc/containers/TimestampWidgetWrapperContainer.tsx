import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearError } from '../../../commons/actions/app';
import BaseWSPError from '../../../commons/errors/BaseWSPError';
import FatalError from '../../../commons/errors/FatalError';
import { selectors as appSelectors } from '../../../commons/modules/app';

import { State } from '../modules';

import TimestampWidgetWrapper from '../components/TimestampWidgetWrapper';

type OwnProps = {
  children: React.ReactNode;
};

const TimestampWidgetWrapperContainer = (props: OwnProps) => {
  const loading = useSelector((state: State) =>
    appSelectors.loadingSelector(state)
  );
  const error = useSelector(
    (state: State) => state.common.app.error
  ) as BaseWSPError;
  const unexpectedError = useSelector(
    (state: State) => state.common.app.unexpectedError
  ) as FatalError;
  const confirmDialog: any = useSelector(
    (state: State) => state.common.app.confirmDialog
  );
  const dialog = useSelector((state: State) => state.common.dialog);

  const dispatch = useDispatch();

  const handleCloseErrorDialog = useCallback(() => {
    dispatch(clearError());
  }, []);

  return (
    <TimestampWidgetWrapper
      loading={loading}
      error={error}
      unexpectedError={unexpectedError}
      confirmDialog={confirmDialog}
      handleCloseErrorDialog={handleCloseErrorDialog}
      dialog={dialog}
    >
      {props.children}
    </TimestampWidgetWrapper>
  );
};

export default TimestampWidgetWrapperContainer;
