import React, { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import EventActions from '../../action-dispatchers/legal-agreement/event';

import LimitHourList from '../../presentational-components/LegalAgreement/DetailPane/LimitHourList';

type Props = {
  disabled: boolean;
};

const mapStateToProps = (state) => ({
  event: state.legalAgreement.ui.detail.limitEvent,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const event = EventActions(dispatch);

    return {
      onClickEditButton: event.setShowFlag,
    };
  }, [dispatch]);
};

const LimitHourListContainer: React.FC<Props> = ({ disabled }) => {
  const stateProps = useSelector(mapStateToProps, shallowEqual);
  const dispatchProps = useMapDispatchToProps();
  const dispatch = useDispatch();
  const onClickEditButton = (flag) => {
    const event = EventActions(dispatch);
    dispatchProps.onClickEditButton(flag);
    event.setIsLoading(false);
  };
  return (
    <LimitHourList
      disabled={disabled}
      {...stateProps}
      onClickEditButton={onClickEditButton}
    />
  );
};

export default LimitHourListContainer;
