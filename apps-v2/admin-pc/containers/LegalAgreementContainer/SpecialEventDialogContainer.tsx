import React, { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import EventActions from '../../action-dispatchers/legal-agreement/specialEvent';

import SpecialEventDialog from '../../presentational-components/LegalAgreement/DetailPane/SpecialEventDialog';

const mapStateToProps = (state) => ({
  isShow: state.legalAgreement.ui.specialEvent.isShowSpecial,
  isLoading: state.legalAgreement.ui.specialEvent.isLoading,
  event: state.legalAgreement.ui.specialEvent.specialEvent,
  detailEvent: state.legalAgreement.ui.detail.specialEvent,
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
      onSubmit: event.setSpecialEvent,
    };
  }, [dispatch]);
};

const SpecialEventDialogContainer: React.FC = () => {
  const stateProps = useSelector(mapStateToProps, shallowEqual);
  const dispatchProps = useMapDispatchToProps();
  return <SpecialEventDialog {...stateProps} {...dispatchProps} />;
};

export default SpecialEventDialogContainer;
