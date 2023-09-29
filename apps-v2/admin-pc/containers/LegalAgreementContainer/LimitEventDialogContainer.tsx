import React, { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import EventActions from '../../action-dispatchers/legal-agreement/event';

import LimitEventDialog from '../../presentational-components/LegalAgreement/DetailPane/LimitEventDialog';

const mapStateToProps = (state) => ({
  isShow: state.legalAgreement.ui.event.isShowLimit,
  isLoading: state.legalAgreement.ui.event.isLoading,
  event: state.legalAgreement.ui.event.limitEvent,
  detailEvent: state.legalAgreement.ui.detail.limitEvent,
  workSystem: state.tmpEditRecord.workSystem,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const event = EventActions(dispatch);

    return {
      setEvent: event.set,
      setLoading: event.setIsLoading,
      onClickEditButton: event.update,
      onCancel: event.setShowFlag,
      onSubmit: event.setLimitEvent,
    };
  }, [dispatch]);
};

const LimitEventDialogContainer: React.FC = () => {
  const stateProps = useSelector(mapStateToProps, shallowEqual);
  const dispatchProps = useMapDispatchToProps();
  return <LimitEventDialog {...stateProps} {...dispatchProps} />;
};

export default LimitEventDialogContainer;
